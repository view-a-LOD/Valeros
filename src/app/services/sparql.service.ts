import { Injectable } from '@angular/core';
import { Settings } from '../config/settings';
import { wrapWithAngleBrackets } from '../helpers/util.helper';
import { CopyrightData } from '../models/IIIF/copyright-data.model';
import { IIIFItem } from '../models/IIIF/iiif-item.model';
import { EndpointUrlsModel } from '../models/endpoint.model';
import { Direction, NodeModel, NodeObj } from '../models/node.model';
import { SparqlIncomingRelationModel } from '../models/sparql/sparql-incoming-relation.model';
import { SparqlNodeParentModel } from '../models/sparql/sparql-node-parent.model';
import { SparqlPredObjModel } from '../models/sparql/sparql-pred-obj.model';
import { ThingWithLabelModel } from '../models/thing-with-label.model';
import { ApiService } from './api.service';
import { EndpointService } from './endpoint.service';
import { SettingsService } from './settings.service';

@Injectable({
  providedIn: 'root',
})
export class SparqlService {
  // TODO: Use library for this (e.g., N3.js)
  constructor(
    private api: ApiService,
    private settings: SettingsService,
    private endpoints: EndpointService,
  ) {}

  getFederatedQuery(
    queryTemplate: string,
    queryEndpoints?: EndpointUrlsModel[],
  ): string {
    const firstEndpoint = queryEndpoints
      ? queryEndpoints[0].sparql
      : this.endpoints.getFirstUrls().sparql;
    const firstServiceQuery = `
{
  SERVICE <${firstEndpoint}> {
      ${queryTemplate}
      BIND("${firstEndpoint}" AS ?endpointUrl)
  }
}`;

    const unionEndpoints = queryEndpoints
      ? queryEndpoints.slice(1)
      : this.endpoints.getAllEnabledUrls().slice(1);
    const unionServiceQueries = unionEndpoints.map(
      (endpoint) => `
UNION {
    SERVICE <${endpoint.sparql}> {
        ${queryTemplate}
        BIND("${endpoint.sparql}" AS ?endpointUrl)
    }
}`,
    );

    return `${firstServiceQuery}\n${unionServiceQueries.join('\n')}`;
  }

  private _ensureNodeHasId(node: NodeModel): void {
    const isValidNode =
      node !== undefined &&
      node['@id'] !== undefined &&
      node['@id'].length !== 0;
    if (!isValidNode) {
      throw new Error('Node without ID passed');
    }
  }

  private _ensureEndpointsExist(): void {
    if (Object.keys(Settings.endpoints).length === 0) {
      throw new Error('No endpoints defined');
    }
  }

  async getIncomingRelations(
    node: NodeModel,
  ): Promise<SparqlIncomingRelationModel[]> {
    this._ensureNodeHasId(node);
    this._ensureEndpointsExist();

    const incomingRelationsQueryTemplate = `?sub ?pred <${node['@id'][0].value}>`;
    const query = `
SELECT DISTINCT ?sub ?pred WHERE {
 ${this.getFederatedQuery(incomingRelationsQueryTemplate)}
}

limit 500`;

    try {
      return await this.api.postData<SparqlIncomingRelationModel[]>(
        this.endpoints.getFirstUrls().sparql,
        {
          query: query,
        },
      );
    } catch (error) {
      console.warn('Failed to fetch incoming relations:', error);
      return [];
    }
  }

  async getAllParents(node: NodeModel): Promise<SparqlNodeParentModel[]> {
    this._ensureNodeHasId(node);
    this._ensureEndpointsExist();

    const parentIris = Settings.predicates.parents.map((iri) =>
      wrapWithAngleBrackets(iri),
    );
    const labelIris = Settings.predicates.label.map((iri) =>
      wrapWithAngleBrackets(iri),
    );

    const parentQueryTemplate = `
    <${node['@id'][0].value}> ${parentIris.join('*|')}* ?id .
    OPTIONAL { ?id ${labelIris.join('|')} ?title . }
    OPTIONAL { ?id ${parentIris.join('|')} ?parent . }`;

    const query = `
SELECT DISTINCT ?id ?title ?parent WHERE {
  ${this.getFederatedQuery(parentQueryTemplate)}
}

limit 500`;

    try {
      return await this.api.postData<SparqlNodeParentModel[]>(
        this.endpoints.getFirstUrls().sparql,
        {
          query: query,
        },
      );
    } catch (error) {
      console.warn('Failed to fetch parent nodes:', error);
      return [];
    }
  }

  // async getLabelFromLiterals(id: string): Promise<string> {
  //   const literalLabelQueryTemplate = `
  //   <${id}> ?p ?o .
  //   FILTER(isLiteral(?o))
  //   BIND(str(?o) AS ?literalValue)`;
  //
  //   const query = `
  //   SELECT (GROUP_CONCAT(DISTINCT ?literalValue; separator=" ") AS ?label)
  //   WHERE {
  //     ${this._getFederatedQuery(literalLabelQueryTemplate)}
  //   }`;
  //
  //   const labels: { label: string }[] = await this.api.postData<
  //     { label: string }[]
  //   >(Settings.endpoints[0].sparql, {
  //     query: query,
  //   });
  //   if (!labels || labels.length === 0 || labels[0].label.length == 0) {
  //     return replacePrefixes(id);
  //   }
  //   return replacePrefixes(labels[0].label);
  // }

  //   async getRdfsLabel(id: string): Promise<string> {
  //     const labelQueryTemplate = `<${id}> <http://www.w3.org/2000/01/rdf-schema#label> ?label`;
  //
  //     const query = `
  // select distinct ?label where {
  //     ${this._getFederatedQuery(labelQueryTemplate)}
  // }
  // limit 1`;
  //
  //     const labels: { label: string }[] = await this.api.postData<
  //       { label: string }[]
  //     >(Settings.endpoints[0].sparql, {
  //       query: query,
  //     });
  //     if (!labels || labels.length === 0) {
  //       return this.getLabelFromLiterals(id);
  //       // return replacePrefixes(id);
  //     }
  //
  //     return replacePrefixes(labels[0].label);
  //   }

  async getLabels(ids: string[]): Promise<ThingWithLabelModel[]> {
    const idIrisStr = ids.map((id) => wrapWithAngleBrackets(id)).join('\n');
    const labelIrisStr = Settings.predicates.label
      .map((iri) => wrapWithAngleBrackets(iri))
      .join('|');
    const labelQueryTemplate = `
VALUES ?s {
  ${idIrisStr}
}
?s ${labelIrisStr} ?label . ${this._buildLanguageFilter('?label')}`;

    const query = `
SELECT DISTINCT ?s ?label WHERE {
    ${this.getFederatedQuery(labelQueryTemplate)}
}
LIMIT 10000`;

    try {
      const response: { s: string; label: string }[] = await this.api.postData<
        { s: string; label: string }[]
      >(this.endpoints.getFirstUrls().sparql, {
        query: query,
      });
      const labels: ThingWithLabelModel[] = response.map(({ s, label }) => {
        return { '@id': s, label: label };
      });

      return labels;
    } catch (error) {
      console.warn('Failed to fetch labels:', error);
      return [];
    }

    // TODO: Bring back fallback label from literals functionality
    // if (!labels || labels.length === 0) {
    //   return this.getLabelFromLiterals(id);
    //   return replacePrefixes(id);
    // }
    //
    // return replacePrefixes(labels[0].label);
  }

  async getObjIds(id: string, preds: string[]): Promise<string[]> {
    const predsIrisStr = preds
      .map((pred) => wrapWithAngleBrackets(pred))
      .join('/');
    const queryTemplate = `${wrapWithAngleBrackets(id)} ${predsIrisStr} ?o .`;

    const query = `
SELECT DISTINCT ?o WHERE {
    ${this.getFederatedQuery(queryTemplate)}
}
LIMIT 10000`;
    try {
      const response: { o: string }[] = await this.api.postData<
        { o: string }[]
      >(this.endpoints.getFirstUrls().sparql, {
        query: query,
      });
      const objIds = response.map((item) => item.o);

      return objIds;
    } catch (error) {
      console.warn('Failed to fetch objects:', error);
      return [];
    }
  }

  private _buildLanguageFilter(variableName: string = '?obj'): string {
    const literalLanguages: string[] | undefined =
      Settings.content.sparqlLanguageFilterForLiterals;

    if (!literalLanguages || literalLanguages.length === 0) {
      return '';
    }

    const langConditions: string = literalLanguages
      .map((lang) => `LANG(${variableName}) = '${lang}'`)
      .join(' || ');

    return `FILTER(${langConditions} || !isLiteral(${variableName}) || !LANG(${variableName}))`;
  }

  async getNode(id: string): Promise<NodeModel> {
    this._ensureEndpointsExist();

    const queryTemplate = `${wrapWithAngleBrackets(id)} ?pred ?obj . ${this._buildLanguageFilter('?obj')}`;

    const query = `SELECT DISTINCT ?pred ?obj ?endpointUrl WHERE {
        ${this.getFederatedQuery(queryTemplate)}
    }`;

    const results = await this.api.postData<SparqlPredObjModel[]>(
      this.endpoints.getFirstUrls().sparql,
      {
        query: query,
      },
    );
    const nodeData: { [pred: string]: NodeObj[] } = {};
    const endpointIds: Set<string> = new Set();

    for (const result of results) {
      if (result.endpointUrl) {
        const endpointId = this.endpoints.getIdBySparqlUrl(result.endpointUrl);
        endpointIds.add(endpointId);
      }

      const pred = result.pred;
      nodeData[pred] = nodeData[pred] || [];
      const nodeObj = {
        value: result.obj,
        direction: Direction.Outgoing,
      };
      nodeData[pred].push(nodeObj);
    }

    const endpointIdsObjs: NodeObj[] = Array.from(endpointIds).map((id) => {
      return { value: id, direction: Direction.Outgoing } as NodeObj;
    });

    return {
      '@id': [{ value: id, direction: Direction.Outgoing }],
      endpointId: endpointIdsObjs,
      ...nodeData,
    };
  }

  // TODO: Make this more generic (not RAZU specific)
  async getCopyrightData(id: string): Promise<CopyrightData[] | null> {
    const copyrightQueryTemplate = `
<${id}> ldto:beperkingGebruik ?beperkingGebruik .
?beperkingGebruik ldto:beperkingGebruikType ?beperkingGebruikType .
OPTIONAL { ?beperkingGebruikType <http://www.w3.org/2004/02/skos/core#prefLabel> ?copyrightNotice . }`;

    const query = `
    PREFIX ldto: <https://data.razu.nl/def/ldto/>
    PREFIX schema: <http://schema.org/>
    SELECT distinct ?copyrightNotice ?beperkingGebruikType WHERE {
        ${this.getFederatedQuery(copyrightQueryTemplate)}
    }`;

    const results: { copyrightNotice: string; beperkingGebruikType: string }[] =
      await this.api.postData<
        { copyrightNotice: string; beperkingGebruikType: string }[]
      >(this.endpoints.getFirstUrls().sparql, {
        query: query,
      });
    if (!results || results.length === 0) {
      return null;
    }
    return results;
  }

  async shouldShowIIIF(id: string): Promise<boolean> {
    // console.log('Checking should show IIIF for', id);

    // TODO: Consider running a "lighter" query to check this, now the query is executed twice: Once for checking if should show, once for getting data
    const iiifData = await this.getIIIFItemsData(id);
    return iiifData.length > 0;
  }

  // TODO: Make non-RAZU specific
  async getIIIFItemsData(id: string): Promise<IIIFItem[]> {
    const altoFormats = Settings.iiif.fileFormats.alto
      .map((f: string) => `<${f}>`)
      .join(', ');
    const imageFormats = [
      ...Settings.iiif.fileFormats.jpg.map((f: string) => `<${f}>`),
      ...Settings.iiif.fileFormats.tif.map((f: string) => `<${f}>`),
    ].join(', ');

    const iiifDataQueryTemplate = `
?fileURI a ldto:Bestand ;
          ldto:isRepresentatieVan <${id}> ;
          ldto:bestandsformaat ?format ;
          ldto:naam ?name ;
          ldto:URLBestand ?url ;
          iiif:service ?iiifService ;
          schema:width ?width ;
          schema:height ?height ;
          schema:position ?position .

OPTIONAL {
    ?altoURI ldto:URLBestand ?altoUrl ;
            ldto:isRepresentatieVan <${id}> ;
            schema:position ?position ;
            ldto:naam ?altoName ;
            ldto:bestandsformaat ?altoFormat .

            FILTER(?altoFormat IN (${altoFormats}))
}

FILTER(?format IN (${imageFormats})) # JPG, TIF`;

    const query = `
PREFIX ldto: <https://data.razu.nl/def/ldto/>
PREFIX iiif: <http://iiif.io/api/presentation/3#>
PREFIX schema: <http://schema.org/>
SELECT DISTINCT ?fileURI ?format ?name ?url ?iiifService ?width ?height ?position ?altoURI ?altoUrl ?altoName WHERE {
 ${this.getFederatedQuery(iiifDataQueryTemplate)}
} ORDER BY ?position`;

    try {
      const iiifItems: IIIFItem[] = await this.api.postData<IIIFItem[]>(
        this.endpoints.getFirstUrls().sparql,
        {
          query: query,
        },
      );

      return iiifItems.map((item) => {
        item.file = item.fileURI.split('/').pop() || '';
        return item;
      });
    } catch (error) {
      console.warn('Failed to fetch IIIF items data:', error);
      return [];
    }
  }

  async getAltoUrl(id: string, pageNum: number): Promise<string | null> {
    const sparqlTemplate = `
  ?bestand_uri ldto:isRepresentatieVan <${id}> .
  ?bestand_uri a ldto:Bestand .
  ?bestand_uri ldto:bestandsformaat <https://data.razu.nl/id/bestandsformaat/63e8775df9a69fa0aadbb461fafe4c1e> .
  ?bestand_uri ldto:URLBestand ?altoUrl .
  ?bestand_uri schema:position "${pageNum}"^^<http://www.w3.org/2001/XMLSchema#integer> .

 `;
    const query = `
prefix ldto: <https://data.razu.nl/def/ldto/>
prefix schema: <http://schema.org/>

select ?altoUrl where {
     ${this.getFederatedQuery(sparqlTemplate)}
} limit 100`;

    const results: { altoUrl: string }[] = await this.api.postData<
      { altoUrl: string }[]
    >(this.endpoints.getFirstUrls().sparql, {
      query: query,
    });
    if (!results || results.length === 0) {
      return null;
    }
    return results[0].altoUrl;
  }
}

import { Component } from '@angular/core';
import type { SearchQueryModel } from '@valeros/shared/types';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
})
export class HomeComponent {
  title = 'Frontend Test - Home';

  createSearchQuery(): SearchQueryModel {
    return {
      query: 'night*',
      endpoints: [
        // Defined in Valeros config, optionally toggled/disabled by user through UI checkboxes
        {
          type: 'sparql',
          url: 'https://sparql.goudatijdmachine.nl/',
        },
        // {
        //   type: "qlever",
        //   url: "https://.../api/dataset",
        // },
        // {
        //   type: "elastic",
        //   url: "https://.../_search",
        // },
      ],
      filters: [
        {
          predicates: [
            'rdf:type',
            'https://www.ica.org/standards/RiC/ontology#hasRecordSetType',
            'schema:additionalType',
            'http://www.wikidata.org/entity/P31',
          ],
          objects: [
            // "Visual" types (selected by user through UI checkbox)
            'schema:CreativeWork',
            'schema:Drawing',
            'schema:ImageObject',
            'schema:Map',
            'schema:Photograph',
            'schema:VideoObject',

            // "People" types (selected by user through UI checkbox)
            'schema:Person',
            'https://data.cbg.nl/pico#PersonObservation',
            'foaf:Agent',
            'http://www.nationaalarchief.nl/mdto#archiefvormer',

            // ...
          ],
        },
        // When "objects" field is left out: node has to have at least one value for at least one of the predicates
        // In this case, we are only looking for nodes that have at least one value for at least one copyright-related predicate
        {
          predicates: [
            'dc:rights',
            'dc:license',
            'http://creativecommons.org/ns#license',
            'schema:copyrightHolder',
            'schema:license',
          ],
        },
        {
          // When "predicates" field is left out: node has to refer to at least one of the objects
          // In this case, we are only looking for nodes that refer to Rembrandt van Rijn in any way
          objects: [
            // Rembrandt van Rijn
            'http://www.wikidata.org/entity/Q5598',
            'https://data.rkd.nl/artists/66219',
          ],
        },
      ],
      sorting: {
        predicates: [
          'dc:title',
          'rdfs:label',
          'schema:name',
          'http://www.w3.org/2004/02/skos/core#prefLabel',
        ],
        direction: 'asc',
      },
      retrieve: {
        selectors: [
          {
            // Fetch some predicate values for the root hits
            // Flow: Node --identifier/type/...--> string
            scope: 'roots',
            paths: [
              {
                path: 'dc:identifier|rdf:type|*',
              },
            ],
          },
          {
            // For every node returned (roots + expanded nodes), fetch labels
            // Flow: Node --label/title--> string
            scope: 'all',
            paths: [
              {
                path: 'rdfs:label|dc:title',
                languages: ['nl', 'en'],
              },
            ],
          },
          {
            // SKOS-XL labels through intermediate node
            // Flow: Node --prefLabel--> Label node --literalForm--> string
            scope: 'all',
            paths: [
              {
                path: 'skosxl:prefLabel/skosxl:literalForm',
                languages: ['nl', 'en'],
              },
            ],
          },
          {
            // Creator/author information
            // Flow: Root node --creator|author--> Person node --givenName|familyName|...--> string
            scope: 'roots',
            paths: [
              {
                path: 'dc:creator|schema:author/(schema:givenName|schema:familyName|schema:birthDate|schema:deathDate)',
              },
            ],
          },
          {
            // Production location information (two hops)
            // Flow: Root node --was_produced_by--> ProductionEvent node --took_place_at--> Place node --lat|long|address--> string
            scope: 'roots',
            paths: [
              {
                path: 'crm:P108i_was_produced_by/crm:P7_took_place_at/(geo:lat|geo:long)',
              },
              {
                path: 'crm:P108i_was_produced_by/crm:P7_took_place_at/schema:address',
                languages: ['nl', 'en'],
              },
            ],
          },
          {
            // Incoming links: Details of authors/creators of documents about this node (two hops)
            // Flow: Root node <--about|mentions-- Document node <--author|creator-- Person node --givenName|familyName|...--> string
            scope: 'roots',
            paths: [
              {
                path: '^(schema:about|schema:mentions)^(schema:author|dc:creator)/(schema:givenName|schema:familyName|schema:birthDate|schema:deathDate)',
              },
            ],
          },
        ],
      },
      prefixes: [
        { prefix: 'dc', namespace: 'http://purl.org/dc/terms/' },
        {
          prefix: 'rdf',
          namespace: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
        },
        { prefix: 'rdfs', namespace: 'http://www.w3.org/2000/01/rdf-schema#' },
        { prefix: 'schema', namespace: 'https://schema.org/' },
        { prefix: 'skosxl', namespace: 'http://www.w3.org/2008/05/skos-xl#' },
        { prefix: 'crm', namespace: 'http://www.cidoc-crm.org/cidoc-crm/' },
        {
          prefix: 'geo',
          namespace: 'http://www.w3.org/2003/01/geo/wgs84_pos#',
        },
        { prefix: 'foaf', namespace: 'http://xmlns.com/foaf/0.1/' },
        { prefix: 'skos', namespace: 'http://www.w3.org/2004/02/skos/core#' },
        { prefix: 'cc', namespace: 'http://creativecommons.org/ns#' },
        { prefix: 'wd', namespace: 'http://www.wikidata.org/entity/' },
      ],
    };
  }

  onSearchButtonClick(): void {
    const query = this.createSearchQuery();
    console.log('Search query:', query);
  }
}

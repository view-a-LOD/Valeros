import { DatePipe, registerLocaleData } from '@angular/common';
import localeNl from '@angular/common/locales/nl';
import { Component, inject, Input, OnInit } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { featherHelpCircle } from '@ng-icons/feather-icons';
import { Direction, NodeObj } from '../../../../../models/node.model';
import { HopLinkSettings } from '../../../../../models/settings/hop-link-settings.model';
import { PredicateVisibility } from '../../../../../models/settings/predicate-visibility-settings.model';
import { TypeRenderComponentInput } from '../../../../../models/type-render-component-input.model';
import { IIIFService } from '../../../../../services/iiif.service';
import { NodeService } from '../../../../../services/node/node.service';
import { SparqlService } from '../../../../../services/sparql.service';
import { UrlService } from '../../../../../services/url.service';
import { HopLinkComponent } from '../../../../features/node/node-render-components/predicate-render-components/hop-components/hop-link/hop-link.component';
import { SnippetComponent } from '../../../../features/snippet/snippet.component';
import { TypeRenderComponent } from '../type-render-component.component';

// Register Dutch locale
registerLocaleData(localeNl);

@Component({
  selector: 'app-razu-aflevering',
  standalone: true,
  imports: [HopLinkComponent, DatePipe, NgIcon, SnippetComponent],
  templateUrl: './razu-aflevering.component.html',
  styleUrls: ['./razu-aflevering.component.scss'],
})
export class RazuAfleveringComponent
  extends TypeRenderComponent
  implements OnInit
{
  nodeService = inject(NodeService);
  urlService = inject(UrlService);
  iiifService = inject(IIIFService);

  altoUrl = '';

  // Arrays to store IDs retrieved from hop-link components
  onderdeelVanIds: string[] = [];
  beperkingGebruikIds: string[] = [];
  dekkingInTijdIds: string[] = [];
  // Map to store dekkingInRuimteIds for each onderdeelVanId
  dekkingInRuimteMap: Map<string, string[]> = new Map();
  // Maps to store begin and end dates for each onderdeelVanId
  beginDateMap: Map<string, string> = new Map();
  endDateMap: Map<string, string> = new Map();
  copyrightNoticeMap: Map<string, string[]> = new Map();
  noteMap: Map<string, string[]> = new Map();
  beperkingGebruikTypeMap: Map<string, string[]> = new Map();
  beperkingGebruikTermijnMap: Map<string, string[]> = new Map();
  copyrightNoteMap: Map<string, string[]> = new Map();
  termijnEinddatumMap: Map<string, string> = new Map();
  representationMap: Map<string, string[]> = new Map();
  // Map: representation node id -> list of image URLs (resolved via URLBestand)
  imageRepUrlMap: Map<string, string[]> = new Map();
  // Map: representation node id -> page number (schema.org/position)
  imageRepPageMap: Map<string, string> = new Map();
  // Map: representation node id -> file size in bytes (ldto/omvang)
  imageRepSizeMap: Map<string, string> = new Map();
  hasBeginDate = false;
  hasEndDate = false;
  hasType = false;
  repMetaLoaded = false;
  repMetaFetching = false;
  @Input() visibility!: PredicateVisibility;

  // Loading state
  loading = false;

  // UI state
  showCopyrightInfo = false;
  hideDownloads = false;

  // Explicitly declare data property from parent class for template access
  override data?: TypeRenderComponentInput;

  trackByRep(index: number, rep: NodeObj): string {
    return rep.value;
  }

  // Hop settings for isOnderdeelVan
  onderdeelVanSettings: HopLinkSettings = {
    preds: ['https://data.razu.nl/def/ldto/isOnderdeelVan'],
    showHops: false,
    showOriginalLink: false,
  };

  // Hop settings for beperkingGebruik
  beperkingGebruikSettings: HopLinkSettings = {
    preds: ['https://data.razu.nl/def/ldto/beperkingGebruik'],
    showHops: false,
    showOriginalLink: false,
  };

  // Hop settings for related properties
  naamSettings: HopLinkSettings = {
    preds: ['https://data.razu.nl/def/ldto/naam'],
    showHops: false,
    showOriginalLink: false,
  };

  dekkingInRuimteSettings: HopLinkSettings = {
    preds: ['https://data.razu.nl/def/ldto/dekkingInRuimte'],
    showHops: false,
    showOriginalLink: false,
  };

  beginDateSettings: HopLinkSettings = {
    preds: [
      'https://data.razu.nl/def/ldto/dekkingInTijd',
      'https://data.razu.nl/def/ldto/dekkingInTijdBeginDatum',
    ],
    showHops: false,
    showOriginalLink: false,
  };

  endDateSettings: HopLinkSettings = {
    preds: [
      'https://data.razu.nl/def/ldto/dekkingInTijd',
      'https://data.razu.nl/def/ldto/dekkingInTijdEindDatum',
    ],
    showHops: false,
    showOriginalLink: false,
  };

  omschrijvingSettings: HopLinkSettings = {
    preds: ['https://data.razu.nl/def/ldto/omschrijving'],
    showHops: false,
    showOriginalLink: false,
  };

  prefLabelSettings: HopLinkSettings = {
    preds: ['http://www.w3.org/2004/02/skos/core#prefLabel'],
    showHops: false,
    showOriginalLink: false,
  };

  copyrightNoticeSettings: HopLinkSettings = {
    preds: [
      'https://data.razu.nl/def/ldto/beperkingGebruikType',
      'http://schema.org/copyrightNotice',
    ],
    showHops: false,
    showOriginalLink: false,
  };

  noteSettings: HopLinkSettings = {
    preds: [
      'https://data.razu.nl/def/ldto/beperkingGebruikType',
      'http://www.w3.org/2004/02/skos/core#note',
    ],
    showHops: false,
    showOriginalLink: false,
  };

  representationSettings: HopLinkSettings = {
    preds: ['https://data.razu.nl/def/ldto/URLBestand'],
    showHops: false,
    showOriginalLink: false,
  };

  constructor(private sparqlService: SparqlService) {
    super();
  }

  ngOnInit(): void {
    // TODO: Reload on node change/update
    this.initAltoUrl();

    // Fetch onderdeelVanIds directly in the component
    if (this.data?.node?.['@id']?.[0]?.value) {
      this.loading = true;

      // Create a Promise array for all data fetching
      const allPromises: Promise<any>[] = [];

      // Fetch onderdeelVanIds and related data
      const onderdeelVanPromise = this.sparqlService
        .getObjIds(
          this.data.node['@id'][0].value,
          this.onderdeelVanSettings.preds,
        )
        .then((ids) => {
          this.onderdeelVanIds = ids;

          // Create an array of promises for all data fetching
          const promises: Promise<void>[] = [];

          // Fetch dekkingInRuimteIds for each onderdeelVanId
          ids.forEach((id) => {
            // Get dekkingInRuimte data
            const ruimtePromise = this.sparqlService
              .getObjIds(id, this.dekkingInRuimteSettings.preds)
              .then((ruimteIds) => {
                this.dekkingInRuimteMap.set(id, ruimteIds);
              });
            promises.push(ruimtePromise);

            // Get begin date data
            const beginDatePromise = this.sparqlService
              .getObjIds(id, this.beginDateSettings.preds)
              .then((dateIds) => {
                if (dateIds.length > 0) {
                  this.beginDateMap.set(id, dateIds[0]);
                }
              });
            promises.push(beginDatePromise);

            // Get end date data
            const endDatePromise = this.sparqlService
              .getObjIds(id, this.endDateSettings.preds)
              .then((dateIds) => {
                if (dateIds.length > 0) {
                  this.endDateMap.set(id, dateIds[0]);
                }
              });
            promises.push(endDatePromise);
          });

          return Promise.all(promises);
        });

      allPromises.push(onderdeelVanPromise);

      // Fetch beperkingGebruikIds and related data
      const beperkingGebruikPromise = this.sparqlService
        .getObjIds(
          this.data.node['@id'][0].value,
          this.beperkingGebruikSettings.preds,
        )
        .then((ids) => {
          this.beperkingGebruikIds = ids;
          // console.log('Found beperkingGebruikIds:', ids);

          // Create an array of promises for all data fetching
          const promises: Promise<void>[] = [];

          // Fetch data for each beperkingGebruikId
          ids.forEach((id) => {
            // get copyrightNotice
            const copyrightNoticePromise = this.sparqlService
              .getObjIds(id, this.copyrightNoticeSettings.preds)
              .then((copyrightNoticeIds) => {
                if (copyrightNoticeIds.length > 0) {
                  // console.log(
                  //   `Found copyright notices for ${id}:`,
                  //   copyrightNoticeIds,
                  // );
                  this.copyrightNoticeMap.set(id, copyrightNoticeIds);
                }
              });
            promises.push(copyrightNoticePromise);

            const copyrightNotePromise = this.sparqlService
              .getObjIds(id, this.noteSettings.preds)
              .then((noteIds) => {
                if (noteIds.length > 0) {
                  console.log(`Found notes for ${id}:`, noteIds);
                  this.copyrightNoteMap.set(id, noteIds);
                }
              });
            promises.push(copyrightNotePromise);

            const beperkingGebruikTypePromise = this.sparqlService
              .getObjIds(id, [
                'https://data.razu.nl/def/ldto/beperkingGebruikType',
              ])
              .then((typeIds) => {
                if (typeIds.length > 0) {
                  // console.log(`Found types for ${id}:`, typeIds);
                  this.beperkingGebruikTypeMap.set(id, typeIds);
                }
              });
            promises.push(beperkingGebruikTypePromise);

            const beperkingGebruikTermijnPromise = this.sparqlService
              .getObjIds(id, [
                'https://data.razu.nl/def/ldto/beperkingGebruikTermijn',
              ])
              .then((termijnIds) => {
                if (termijnIds.length > 0) {
                  this.beperkingGebruikTermijnMap.set(id, termijnIds);
                  termijnIds.forEach((termijnId) => {
                    const termijnEinddatumPromise = this.sparqlService
                      .getObjIds(termijnId, [
                        'https://data.razu.nl/def/ldto/termijnEinddatum',
                      ])
                      .then((dateIds) => {
                        if (dateIds.length > 0) {
                          this.termijnEinddatumMap.set(termijnId, dateIds[0]);
                        }
                      });
                  });
                }
              });
            promises.push(beperkingGebruikTermijnPromise);
          });

          return Promise.all(promises);
        });

      allPromises.push(beperkingGebruikPromise);

      // // Preload representation URLs and keep only images
      // const reps: NodeObj[] = (this.data.node['https://data.razu.nl/def/ldto/isRepresentatieVan'] || []);
      // const representationPromises = reps.map(async (rep) => {
      //     const urls = await this.sparqlService.getObjIds(rep.value, this.representationSettings.preds);
      //     const imageUrls = urls.filter((u) => this.isImageUrl(u));
      //     if (imageUrls.length > 0) {
      //         this.imageRepUrlMap.set(rep.value, imageUrls);
      //     }

      //     // Fetch page number (position)
      //     const positions = await this.sparqlService.getObjIds(rep.value, ['http://schema.org/position']);
      //     if (positions.length > 0) {
      //         this.imageRepPageMap.set(rep.value, positions[0]);
      //     }

      //     // Fetch file size (omvang)
      //     const sizes = await this.sparqlService.getObjIds(rep.value, ['https://data.razu.nl/def/ldto/omvang']);
      //     if (sizes.length > 0) {
      //         this.imageRepSizeMap.set(rep.value, sizes[0]);
      //     }
      // });
      // allPromises.push(Promise.all(representationPromises));

      // Wait for all promises to complete
      Promise.all(allPromises)
        .catch((error) => {
          console.error('Error fetching data:', error);
        })
        .finally(() => {
          this.loading = false;
          // console.log('Final data:');
          // console.log('beperkingGebruikIds', this.beperkingGebruikIds);
          // console.log('copyrightNoticeMap', this.copyrightNoticeMap);
          // console.log('copyrightNoteMap', this.copyrightNoteMap);
          // console.log('beperkingGebruikTypeMap', this.beperkingGebruikTypeMap);
          // console.log(
          //   'beperkingGebruikTermijnMap',
          //   this.beperkingGebruikTermijnMap,
          // );
        });

      // Check if downloads should be hidden due to copyright restrictions
      const nodeId = this.nodeService.getId(this.data?.node);
      if (nodeId) {
        this.iiifService
          .imagesAreCopyrightAccessible(nodeId)
          .then((imagesAreAccessible) => {
            this.hideDownloads = !imagesAreAccessible;
          })
          .catch((error) => {
            console.error('Error checking copyright restrictions:', error);
            this.hideDownloads = false;
          });
      }
    }
  }

  private async loadRepresentationMetadataOnce(): Promise<void> {
    if (this.repMetaLoaded || this.repMetaFetching) return;

    const reps: NodeObj[] =
      this.data?.node?.['https://data.razu.nl/def/ldto/isRepresentatieVan'] ||
      [];
    if (!reps.length) return;

    this.repMetaFetching = true;
    try {
      await Promise.all(
        reps.map(async (rep) => {
          // Single call to fetch all triples for the representation node
          const node = await this.sparqlService.getNode(rep.value);

          // Extract URLs via URLBestand
          const urlObjs =
            node['https://data.razu.nl/def/ldto/URLBestand'] || [];
          const urls = urlObjs.map((o) => o.value);
          const imageUrls = urls.filter((u) => this.isImageUrl(u));
          if (imageUrls.length > 0) {
            this.imageRepUrlMap.set(rep.value, imageUrls);
          }

          // Extract page number (schema.org/position)
          const posObjs = node['http://schema.org/position'] || [];
          if (posObjs.length > 0) {
            this.imageRepPageMap.set(rep.value, posObjs[0].value);
          }

          // Extract file size (ldto/omvang)
          const sizeObjs = node['https://data.razu.nl/def/ldto/omvang'] || [];
          if (sizeObjs.length > 0) {
            this.imageRepSizeMap.set(rep.value, sizeObjs[0].value);
          }
        }),
      );
      this.repMetaLoaded = true;
    } finally {
      this.repMetaFetching = false;
    }
  }
  // Helper method to get labels for dekkingInRuimteIds
  getDekkingInRuimteIds(onderdeelVanId: string): string[] {
    return this.dekkingInRuimteMap.get(onderdeelVanId) || [];
  }

  // Helper methods for date handling
  hasBeginDateForId(onderdeelVanId: string): boolean {
    return this.beginDateMap.has(onderdeelVanId);
  }

  hasEndDateForId(onderdeelVanId: string): boolean {
    return this.endDateMap.has(onderdeelVanId);
  }

  getBeginDate(onderdeelVanId: string): string {
    return this.beginDateMap.get(onderdeelVanId) || '';
  }

  getEndDate(onderdeelVanId: string): string {
    return this.endDateMap.get(onderdeelVanId) || '';
  }

  getTermijnEinddatum(termijnId: string): string {
    return this.termijnEinddatumMap.get(termijnId) || '';
  }

  onDownloadToggle(event: Event): void {
    const open = (event.target as HTMLDetailsElement)?.open;
    if (open) {
      void this.loadRepresentationMetadataOnce();
    }
  }
  // Returns true if the URL points to an image file
  isImageUrl(url?: string): boolean {
    const u = url?.toLowerCase?.();
    if (!u) return false;
    return /(\.jpg|\.jpeg|\.png|\.gif|\.tif|\.tiff|\.webp|\.bmp)(\?.*)?$/.test(
      u,
    );
  }

  // Get all image URLs resolved for a representation
  getImageUrls(rep?: NodeObj): string[] {
    if (!rep?.value) return [];
    return this.imageRepUrlMap.get(rep.value) || [];
  }

  // Convenience: first image URL for a representation
  getFirstImageUrl(rep?: NodeObj): string | '' {
    return this.getImageUrls(rep)[0] || '';
  }

  // Page number (as number if parsable)
  getPage(rep?: NodeObj): number | undefined {
    if (!rep?.value) return undefined;
    const p = this.imageRepPageMap.get(rep.value);
    const n = p !== undefined ? Number(p) : NaN;
    return Number.isFinite(n) ? n : undefined;
  }

  // File size in bytes (as number if parsable)
  getSizeBytes(rep?: NodeObj): number | undefined {
    if (!rep?.value) return undefined;
    const s = this.imageRepSizeMap.get(rep.value);
    const n = s !== undefined ? Number(s) : NaN;
    return Number.isFinite(n) ? n : undefined;
  }

  // Human readable bytes (e.g., 22 MB)
  formatBytes(bytes?: number): string {
    if (bytes === undefined || bytes === null || !Number.isFinite(bytes))
      return '';
    const thresh = 1000;
    if (Math.abs(bytes) < thresh) {
      return bytes + ' B';
    }
    const units = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let u = -1;
    let b = bytes;
    do {
      b /= thresh;
      ++u;
    } while (Math.abs(b) >= thresh && u < units.length - 1);
    return b.toFixed(b >= 10 ? 0 : 1) + ' ' + units[u];
  }

  async initAltoUrl() {
    const node = this.data?.node;
    if (!node) {
      return;
    }
    const id = this.nodeService.getId(node);
    const pageNum: number | null = this.urlService.getPageNumberFromUrl();
    if (pageNum == null) {
      return;
    }

    const altoUrl = await this.sparqlService.getAltoUrl(id, pageNum);
    if (altoUrl) {
      this.altoUrl = altoUrl;
    }
  }

  onDetailsToggle(event: Event) {
    const details = event.target as HTMLDetailsElement;
    const summary = details.querySelector('summary');
    if (summary) {
      summary.setAttribute('aria-expanded', details.open.toString());
    }
  }

  protected readonly featherHelpCircle = featherHelpCircle;
  protected readonly Direction = Direction;
}

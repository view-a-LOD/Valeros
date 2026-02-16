import { Injectable } from '@angular/core';
import { Canvas, Manifest } from '@iiif/presentation-3';
import mime from 'mime';
import { Settings } from '../config/settings';
import { intersects } from '../helpers/util.helper';
import { CopyrightData } from '../models/IIIF/copyright-data.model';
import { IIIFItem } from '../models/IIIF/iiif-item.model';
import { ImageService } from './image.service';
import { SparqlService } from './sparql.service';
import { UrlService } from './url.service';

@Injectable({
  providedIn: 'root',
})
export class IIIFService {
  private _blobUrls: Set<string> = new Set();

  constructor(
    private sparql: SparqlService,
    private url: UrlService,
    private imageService: ImageService,
  ) {}

  private async _getCanvasesFromUrls(imgUrls: string[]): Promise<Canvas[]> {
    // imgUrls = [
    //   'https://placehold.co/600x400/png',
    //   'https://placehold.co/500x400/jpg',
    //   'https://placehold.co/400x400/gif',
    //   'https://www.dummyimg.in/placeholder?format=BMP',
    //   'https://placehold.co/300x400/svg',
    //   'https://placehold.co/200x400/webp',
    // ];

    const makeCanvas = (
      url: string,
      index: number,
      width: number,
      height: number,
    ): Canvas => ({
      id: `https://example.org/canvas/p${index + 1}`,
      type: 'Canvas',
      label: {
        en: [(index + 1).toString()],
      },
      height,
      width,
      items: [
        {
          id: `https://example.org/page/p${index + 1}/1`,
          type: 'AnnotationPage',
          items: [
            {
              id: `https://example.org/annotation/p${index + 1}-image`,
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: url,
                type: 'Image',
                format: mime.getType(url) ?? 'image/jpeg',
                height,
                width,
              },
              target: `https://example.org/canvas/p${index + 1}`,
            },
          ],
        },
      ],
    });

    const canvases: Canvas[] = [];
    for (let [index, url] of imgUrls.entries()) {
      try {
        const { width, height } =
          await this.imageService.getImageDimensions(url);
        canvases.push(makeCanvas(url, index, width, height));
      } catch (e) {
        console.error(`Failed to get dimensions for image ${url} :`, e);
      }
    }
    return canvases;
  }

  private _selectPreferredImageFormats(
    items: IIIFItem[],
    preferredFormats: string[],
  ): IIIFItem[] {
    // Group items by position
    const itemsByPosition = items.reduce(
      (acc, item) => {
        const position = item.position;
        if (!acc[position]) {
          acc[position] = [];
        }
        acc[position].push(item);
        return acc;
      },
      {} as { [key: string]: IIIFItem[] },
    );

    // For each position, try formats in order of preference
    return Object.values(itemsByPosition)
      .map((items) => {
        if (items.length === 1) {
          // If only one item and its format is in preferred list, return it
          return preferredFormats.includes(items[0].format) ? items[0] : null;
        }

        // Try each preferred format in order
        for (const format of preferredFormats) {
          const matchingItem = items.find((i) => i.format === format);
          if (matchingItem) {
            return matchingItem;
          }
        }

        // No matching format found
        return null;
      })
      .filter((item): item is IIIFItem => item !== null);
  }

  private async _retrieveCanvasesUsingSparql(id: string): Promise<Canvas[]> {
    let itemsData: IIIFItem[] = await this.sparql.getIIIFItemsData(id);

    itemsData = this._selectPreferredImageFormats(
      itemsData,
      Settings.iiif.preferredImageFormats,
    );

    const processAltoUrl = async (item: IIIFItem) => {
      if (item.altoUrl) {
        item.altoUrl = await this.url.processUrl(item.altoUrl);
      }
      return item;
    };
    itemsData = await Promise.all(
      itemsData.map(async (item) => await processAltoUrl(item)),
    );

    const canvases: Canvas[] = itemsData.map((item) => {
      const canvas: Canvas = {
        id: `https://data.razu.nl/iiif/canvas/${item.file}`,
        type: 'Canvas',
        label: { en: [item.position.toString()] },
        height: item.height,
        width: item.width,
        items: [
          {
            id: `https://data.razu.nl/iiif/page/${item.file}/painting-annotation-page`,
            type: 'AnnotationPage',
            items: [
              {
                id: `https://data.razu.nl/iiif/annotation/${item.file}`,
                type: 'Annotation',
                motivation: 'painting',
                body: {
                  id: `${item.iiifService}/full/${item.width},/0/default.jpg`,
                  type: 'Image',
                  format: 'image/jpeg',
                  service: [
                    {
                      id: `${item.iiifService}`,
                      type: 'ImageService2',
                      profile: 'http://iiif.io/api/image/2/level2.json',
                    },
                  ],
                },
                target: `https://data.razu.nl/iiif/canvas/${item.file}`,
              },
            ],
          },
        ],
        seeAlso: item.altoUrl
          ? [
              {
                '@id': item.altoUrl,
                profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
                format: 'text/xml+alto',
                label: 'METS-ALTO XML',
              } as any,
            ]
          : [],
        thumbnail: [
          {
            id: `${item.iiifService}/full/200,/0/default.jpg`,
            type: 'Image',
            format: 'image/jpeg',
            service: [
              {
                id: `${item.iiifService}`,
                type: 'ImageService2',
                profile: 'http://iiif.io/api/image/2/level2.json',
              },
            ],
          },
        ],
      };
      return canvas;
    });
    return canvases;
  }

  async generateCanvasesManifest(
    id: string,
    label: string,
    canvases: Canvas[],
  ): Promise<Manifest | null> {
    const copyrightData: CopyrightData[] | null =
      await this.sparql.getCopyrightData(id);
    const copyrightNotice: string | undefined = copyrightData
      ?.map((data) => data.copyrightNotice)
      .join(', ');
    const beperkingGebruikTypes: string[] | undefined = copyrightData?.map(
      (data) => data.beperkingGebruikType,
    );

    const imagesAreAccessible = await this.imagesAreCopyrightAccessible(id);

    if (!imagesAreAccessible) {
      await this._replaceCanvasesWithPlaceholders(canvases);
      console.log('Canvases', canvases);
    }

    const manifest: Manifest = {
      '@context': 'http://iiif.io/api/presentation/3/context.json',
      id: id,
      type: 'Manifest',
      label: {
        nl: [label],
      },
      items: canvases,
      requiredStatement: {
        label: {
          en: ['Copyright'],
        },
        value: {
          en: [copyrightNotice ?? ''],
        },
      },
    };

    return manifest;
  }

  async createManifestBlob(
    nodeId?: string,
    nodeLabel?: string,
    imageUrls?: string[],
  ): Promise<string | null> {
    let canvases: Canvas[] = [];
    if (imageUrls) {
      console.log('Creating manifest from image URLs', imageUrls);
      canvases = await this._getCanvasesFromUrls(imageUrls);
    } else if (nodeId) {
      console.log('Creating manifest from node ID using SPARQL', nodeId);
      canvases = await this._retrieveCanvasesUsingSparql(nodeId);
    }

    if (!canvases || canvases.length === 0) {
      return null;
    }

    const manifest: Manifest | null = await this.generateCanvasesManifest(
      nodeId ?? '',
      nodeLabel ?? '',
      canvases,
    );
    if (!manifest) {
      return null;
    }
    console.log('Created manifest:', manifest);

    const manifestFile = new File([JSON.stringify(manifest)], 'manifest.json', {
      type: 'application/json',
    });
    const manifestUrl = URL.createObjectURL(manifestFile);
    this._blobUrls.add(manifestUrl);

    window.addEventListener('beforeunload', () => this._cleanup());

    return manifestUrl;
  }

  private _cleanup() {
    this._blobUrls.forEach((url) => URL.revokeObjectURL(url));
    this._blobUrls.clear();
  }

  private async _replaceCanvasesWithPlaceholders(
    canvases: Canvas[],
  ): Promise<void> {
    const imageUrl = Settings.ui.imageForWhenImageIsInaccessible;
    let placeholderDimensions: { width: number; height: number } = {
      width: 1920,
      height: 1080,
    };

    try {
      placeholderDimensions =
        await this.imageService.getImageDimensions(imageUrl);
    } catch (error) {
      console.error('Failed to get image dimensions:', imageUrl, error);
    }

    canvases.forEach((canvas) => {
      if (canvas.thumbnail && canvas.thumbnail.length > 0) {
        canvas.thumbnail[0].id = imageUrl;
        if ('service' in canvas.thumbnail[0]) {
          delete (canvas.thumbnail[0] as any).service;
        }
      }

      if (canvas.height) {
        canvas.height = placeholderDimensions.height;
      }
      if (canvas.width) {
        canvas.width = placeholderDimensions.width;
      }

      if (canvas.items && canvas.items.length > 0) {
        canvas.items.forEach((annotationPage) => {
          if (annotationPage.items && annotationPage.items.length > 0) {
            annotationPage.items.forEach((annotation) => {
              if (annotation.body) {
                const bodies = Array.isArray(annotation.body)
                  ? annotation.body
                  : [annotation.body];
                bodies.forEach((bodyItem) => {
                  if (typeof bodyItem === 'object' && bodyItem.id) {
                    bodyItem.id = Settings.ui.imageForWhenImageIsInaccessible;
                  }
                  if (typeof bodyItem === 'object' && 'service' in bodyItem) {
                    delete (bodyItem as any).service;
                  }
                });
              }
            });
          }
        });
      }

      if (canvas.service) {
        delete canvas.service;
      }
    });
  }

  // TODO: Make non-RAZU specific
  async imagesAreCopyrightAccessible(id: string): Promise<boolean> {
    const copyrightData: CopyrightData[] | null =
      await this.sparql.getCopyrightData(id);
    const beperkingGebruikTypes: string[] | undefined = copyrightData?.map(
      (data) => data.beperkingGebruikType,
    );

    return copyrightData
      ? !intersects(
          beperkingGebruikTypes ?? [],
          Settings.iiif.showPlaceholdersForCopyrightType || [],
        )
      : true;
  }
}

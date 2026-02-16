import { Injectable } from '@angular/core';
import { Settings } from '../config/settings';
import { FileType } from '../models/file-type.model';
import { SparqlService } from './sparql.service';
import { UrlService } from './url.service';

@Injectable({
  providedIn: 'root',
})
export class FileRenderService {
  constructor(
    private urlService: UrlService,
    private sparql: SparqlService,
  ) {}

  getThumbImageUrl(url: string, fileType: FileType): string {
    if (fileType === FileType.WEB_IMAGE) {
      return url;
    }

    const fileIconUrl = Settings.fileRendering.fileTypes[fileType]?.iconUrl;
    const unknownIconUrl =
      Settings.fileRendering.fileTypes[FileType.UNKNOWN].iconUrl;
    return fileIconUrl ?? unknownIconUrl;
  }

  private _getFileTypeFromExtension(fileExtension: string): FileType {
    for (const [fileType, config] of Object.entries(
      Settings.fileRendering.fileTypes,
    )) {
      if (config.extensions.includes(fileExtension)) {
        return fileType as FileType;
      }
    }
    return FileType.UNKNOWN;
  }

  getFileType(url: string): FileType {
    if (!url) return FileType.UNKNOWN;

    const getFileExtensionFromUrl = (url: string) =>
      url.split('.').pop()?.toLowerCase();

    // First try without query parameters
    const urlWithoutParams = url.split('?')[0];
    const fileExtension = getFileExtensionFromUrl(urlWithoutParams);

    if (fileExtension) {
      const fileType = this._getFileTypeFromExtension(fileExtension);
      if (fileType !== FileType.UNKNOWN) {
        return fileType;
      }
    }

    // If no extension found or not recognized, try again with query parameters
    const fileExtensionWithParams = getFileExtensionFromUrl(url);
    if (fileExtensionWithParams) {
      const fileType = this._getFileTypeFromExtension(fileExtensionWithParams);
      if (fileType !== FileType.UNKNOWN) {
        return fileType;
      }
    }

    // TODO: Finally, support MIME type-based file type detection as a fallback when no extension is found from the URL itself

    return FileType.UNKNOWN;
  }

  async processUrls(
    inputUrls: string | string[],
    hopPreds?: string[],
  ): Promise<string[]> {
    const urls = Array.isArray(inputUrls) ? inputUrls : [inputUrls];
    const validUrls = urls.filter((url) => url);

    if (validUrls.length === 0) {
      return [];
    }

    let unprocessedUrls: string[];
    if (hopPreds && hopPreds.length > 0) {
      const urlPromises = validUrls.map((url) =>
        this.sparql.getObjIds(url, hopPreds),
      );
      const results = await Promise.all(urlPromises);
      unprocessedUrls = results.flat();
    } else {
      unprocessedUrls = validUrls;
    }

    const fileUrls = await Promise.all(
      unprocessedUrls.map((url) => this.urlService.processUrl(url, false)),
    );

    return fileUrls;
  }
}

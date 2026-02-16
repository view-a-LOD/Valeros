export interface IIIFSettings {
  fileFormats: {
    jpg: string[];
    tif: string[];
    alto: string[];
  };
  /**
   * List of preferred image format URIs for IIIF display.
   * These formats are processed in order, and the first available format will be chosen for display.
   * This allows specifying a preference hierarchy (e.g., JPG over TIF) when multiple formats exist.
   */
  preferredImageFormats: string[];

  showPlaceholdersForCopyrightType?: string[];
}

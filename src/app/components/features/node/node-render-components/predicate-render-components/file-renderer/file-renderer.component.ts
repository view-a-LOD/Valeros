import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  type OnInit,
} from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { featherDownload } from '@ng-icons/feather-icons';
import { Settings } from '../../../../../../config/settings';
import { FileType } from '../../../../../../models/file-type.model';
import { FileViewer } from '../../../../../../models/file-viewer.enum';
import { HopLinkSettings } from '../../../../../../models/settings/hop-link-settings.model';
import { FileRenderService } from '../../../../../../services/file-render.service';
import { DocViewerComponent } from '../../../../file-viewers/doc-viewer/doc-viewer.component';
import { NodeImagesComponent } from '../../../node-images/node-images.component';
import { NodeLinkComponent } from '../../../node-link/node-link.component';
import { HopTrailComponent } from '../hop-components/hop-trail/hop-trail.component';

@Component({
  selector: 'app-file-renderer',
  imports: [
    NodeImagesComponent,
    DocViewerComponent,
    NodeLinkComponent,
    HopTrailComponent,
    NgIcon,
  ],
  templateUrl: './file-renderer.component.html',
  styleUrl: './file-renderer.component.scss',
})
export class FileRendererComponent implements OnInit, OnChanges {
  protected readonly FileType = FileType;

  @Input() urls: string | string[] = [];
  @Input() hopSettings?: HopLinkSettings;
  @Input() shownInTableCell = false;
  @Input() isThumb = false;

  @Output() hasViewer = new EventEmitter<boolean>();

  fileUrls: string[] = [];
  loading = false;
  private _preferredViewerData: { urls: string[]; viewer: FileViewer } | null =
    null;

  constructor(public fileRenderService: FileRenderService) {}

  ngOnInit(): void {
    void this._initFileUrls();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['urls'] && !changes['urls'].firstChange) {
      void this._initFileUrls();
    }
  }

  get displayUrls(): string[] {
    if (this.isThumb) {
      const preferredUrl = this.fileUrls.find(
        (url) => this.fileRenderService.getFileType(url) !== FileType.UNKNOWN,
      );
      const firstFileUrl = this.fileUrls[0];
      return preferredUrl ? [preferredUrl] : [firstFileUrl];
    }

    return this.fileUrls;
  }

  get preferredViewerData(): { urls: string[]; viewer: FileViewer } {
    if (!this._preferredViewerData) {
      this._preferredViewerData = this._initPreferredViewerData();
    }
    return this._preferredViewerData;
  }

  private _initHasViewer() {
    const fileTypes = this.fileUrls.map((fileUrl) =>
      this.fileRenderService.getFileType(fileUrl),
    );
    const hasViewableFiles = fileTypes.some(
      (type) => type !== FileType.UNKNOWN,
    );
    this.hasViewer.emit(hasViewableFiles);
  }

  private async _initFileUrls() {
    this.loading = true;
    this._preferredViewerData = null;

    try {
      const fileUrls = await this.fileRenderService.processUrls(
        this.urls,
        this.hopSettings?.preds,
      );

      this.fileUrls = fileUrls;
      this._initHasViewer();
    } finally {
      this.loading = false;
    }
  }

  getFileNameFromUrl(url: string): string {
    try {
      const cleanUrl = url.split('?')[0].split('#')[0];
      const lastSegment = decodeURIComponent(cleanUrl.split('/').pop() || '');
      if (lastSegment && lastSegment.includes('.')) {
        return lastSegment;
      }

      return 'Download bestand';
    } catch {
      return 'Download bestand';
    }
  }

  private _initPreferredViewerData(): {
    urls: string[];
    viewer: FileViewer;
  } {
    const preferredViewerOrder: FileViewer[] =
      Settings.fileRendering.preferredViewerOrder;

    if (!preferredViewerOrder || preferredViewerOrder.length === 0) {
      console.warn('No preferred viewer order, defaulting to link viewer');
      return { urls: this.fileUrls, viewer: FileViewer.Link };
    }

    if (this.fileUrls.length === 0) {
      return { urls: [], viewer: FileViewer.Link };
    }

    const urlsByViewer = new Map<FileViewer, string[]>();
    preferredViewerOrder.forEach((viewer) => {
      urlsByViewer.set(viewer, []);
    });

    this.fileUrls.forEach((url) => {
      const fileType = this.fileRenderService.getFileType(url);

      const useImageViewer =
        fileType === FileType.WEB_IMAGE && urlsByViewer.has(FileViewer.Image);

      const useDocViewer =
        fileType !== FileType.WEB_IMAGE &&
        fileType !== FileType.UNKNOWN &&
        urlsByViewer.has(FileViewer.Doc);

      const useLinkViewer = urlsByViewer.has(FileViewer.Link);

      if (useImageViewer) {
        urlsByViewer.get(FileViewer.Image)!.push(url);
      } else if (useDocViewer) {
        urlsByViewer.get(FileViewer.Doc)!.push(url);
      } else if (useLinkViewer) {
        urlsByViewer.get(FileViewer.Link)!.push(url);
      } else {
        // Default viewer
        urlsByViewer.get(FileViewer.Link)!.push(url);
      }
    });

    for (const viewer of preferredViewerOrder) {
      const urls = urlsByViewer.get(viewer);
      if (urls && urls.length > 0) {
        return { urls, viewer };
      }
    }

    return { urls: this.fileUrls, viewer: FileViewer.Link };
  }

  protected readonly featherDownload = featherDownload;
  protected readonly FileViewer = FileViewer;
}

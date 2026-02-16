import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { Router } from '@angular/router';
import { MiradorHighlightService } from '../../../../services/mirador-highlight.service';
import { MiradorService } from '../../../../services/mirador.service';

@Component({
  selector: 'app-mirador',
  imports: [],
  templateUrl: './mirador.component.html',
  styleUrl: './mirador.component.scss',
})
export class MiradorComponent implements OnChanges, OnDestroy, AfterViewInit {
  viewer?: any;
  private _initializeDebounceTimer?: number;
  containerId: string = '';

  @Input() nodeId?: string;
  @Input() nodeLabel?: string;
  @Input() imageUrls?: string[];

  constructor(
    private miradorService: MiradorService,
    private router: Router,
    private miradorHighlight: MiradorHighlightService,
  ) {}

  ngAfterViewInit() {
    this.initViewer();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['imageUrls'] || changes['nodeId'] || changes['nodeLabel']) {
      if (this._initializeDebounceTimer) {
        console.log('Cancelling previous initialization attempt');

        window.clearTimeout(this._initializeDebounceTimer);
      }

      this._initializeDebounceTimer = window.setTimeout(() => {
        console.log('Initializing Mirador after changes', changes);
        this.initViewer();
        this._initializeDebounceTimer = undefined;
      }, 500);
    }
  }

  ngOnDestroy() {
    this.destroyViewer();
    this.miradorHighlight.stopCheckingForTextElementsInDOM();
  }

  private destroyViewer() {
    if (this._initializeDebounceTimer) {
      window.clearTimeout(this._initializeDebounceTimer);
      this._initializeDebounceTimer = undefined;
    }

    if (this.viewer) {
      this.miradorService.destroyViewer(this.viewer, this.containerId);
      this.viewer = undefined;
    }
  }

  private async initViewer() {
    this.destroyViewer();
    this.containerId = this.miradorService.generateContainerId();

    const manifestUrl: string | null = await this.miradorService[
      'iiifService'
    ].createManifestBlob(this.nodeId, this.nodeLabel, this.imageUrls);

    if (!manifestUrl) {
      console.warn('Failed to create manifest, not initializing viewer');
      return;
    }

    setTimeout(async () => {
      const containerElem = document.getElementById(this.containerId);
      if (!containerElem) {
        console.warn('Container element not found', this.containerId);
        return;
      }

      this.viewer = await this.miradorService.createViewer({
        id: this.containerId,
        manifestId: manifestUrl,
        thumbnailNavigation: window.innerWidth >= 640,
      });

      if (this.viewer) {
        this.miradorService.setupCanvasIndexTrackingInUrl(this.viewer);
        this.miradorHighlight.init();
      }

      console.log('Mirador viewer', this.viewer);
    }, 1);
  }
}

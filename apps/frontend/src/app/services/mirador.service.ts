import { Injectable, NgZone } from '@angular/core';
// @ts-ignore
import Mirador from 'mirador/dist/es/src/index';
// prettier-ignore
// @ts-ignore
import { getCanvasIndex,getCurrentCanvas } from 'mirador/dist/es/src/state/selectors';
// @ts-ignore
import textOverlayPlugin from 'mirador-textoverlay/es/index';
import { BehaviorSubject } from 'rxjs';
import { IIIFService } from './iiif.service';
import { MiradorHighlightService } from './mirador-highlight.service';
import { UrlService } from './url.service';

export interface MiradorConfig {
  id: string;
  manifestId: string;
  canvasIndex?: number;
  thumbnailNavigation?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class MiradorService {
  constructor(
    private ngZone: NgZone,
    private iiifService: IIIFService,
    private urlService: UrlService,
    private miradorHighlight: MiradorHighlightService,
  ) {}

  createViewer(config: MiradorConfig): Promise<any> {
    return this.ngZone.runOutsideAngular(async () => {
      const miradorConfig = this._buildMiradorConfig(config);
      console.log('Mirador init', config.id);
      const miradorInstance = Mirador.viewer(miradorConfig, [
        ...textOverlayPlugin,
      ]);
      this._setupAutoResetZoomOnLoaded(miradorInstance);
      return miradorInstance;
    });
  }

  setupCanvasIndexTrackingInUrl(miradorInstance: any): void {
    const canvasIndex = new BehaviorSubject<number | null>(null);

    canvasIndex.subscribe((index: number | null) => {
      console.log('Canvas index:', index);
      if (index !== null) {
        const pageNumber = index + 1;
        void this.urlService.updatePageInUrl(pageNumber);
      }
    });

    const store = miradorInstance.store;
    const originalDispatch = store.dispatch;

    store.dispatch = (action: any) => {
      const result = originalDispatch(action);
      const currentState = store.getState();

      const windows = currentState.windows || {};
      const windowId = Object.keys(windows)[0];

      const currentCanvas = getCurrentCanvas(currentState, {
        windowId,
      });
      const canvasId = currentCanvas?.id;
      if (canvasId) {
        const canvasIndexValue = getCanvasIndex(currentState, {
          windowId,
          canvasId,
        });
        const canvasIsUpdated = canvasIndexValue !== canvasIndex.value;
        if (canvasIsUpdated) {
          canvasIndex.next(canvasIndexValue);
        }
      }

      return result;
    };
  }

  destroyViewer(viewer: any, containerId: string): void {
    if (viewer) {
      viewer.unmount();
    }

    // Remove JSS styles
    const styleElements = document.querySelectorAll('style[data-jss]');
    styleElements.forEach((styleElement) => {
      styleElement.remove();
    });

    // Clear container
    const containerElem = document.getElementById(containerId);
    if (containerElem) {
      containerElem.innerHTML = '';
    }
  }

  generateContainerId(): string {
    return `mirador-${Math.random().toString(36).substr(2, 9)}`;
  }

  private _buildMiradorConfig(config: MiradorConfig): any {
    const pageNum: number | null = this.urlService.getPageNumberFromUrl();

    return {
      id: config.id,
      workspace: {
        type: 'single',
        showZoomControls: true,
      },
      workspaceControlPanel: {
        enabled: false,
      },
      window: {
        textOverlay: {
          enabled: true,
          selectable: true,
          visible: false,
        },
      },
      windows: [
        {
          manifestId: config.manifestId,
          canvasIndex: config.canvasIndex ?? (pageNum ? pageNum - 1 : 0),
          allowWindowSideBar: true,
          sideBarOpenByDefault: false,
          allowMaximize: false,
          allowFullscreen: true,
          allowClose: false,
          ...(config.thumbnailNavigation
            ? {
                thumbnailNavigationPosition: 'far-right',
                thumbnailNavigationVisible: true,
              }
            : {}),
        },
      ],
    };
  }

  private _setupAutoResetZoomOnLoaded(miradorInstance: any): void {
    const unsubscribe = miradorInstance.store.subscribe(() => {
      const state = miradorInstance.store.getState();

      if (state.windows && Object.keys(state.windows).length > 0) {
        console.log('Mirador loaded');
        setTimeout(() => {
          const resetZoomButton: HTMLButtonElement | null =
            document.querySelector('button[aria-label="Reset zoom"]');
          if (resetZoomButton) {
            console.log('Resetting Mirador zoom');
            resetZoomButton.click();
          }
        }, 1);
        unsubscribe();
      }
    });
  }
}

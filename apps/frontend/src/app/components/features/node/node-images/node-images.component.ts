import { Component, Input } from '@angular/core';
import { Settings } from '../../../../config/settings';
import { MiradorComponent } from '../../file-viewers/mirador/mirador.component';

@Component({
  selector: 'app-node-images',
  imports: [MiradorComponent],
  templateUrl: './node-images.component.html',
  styleUrl: './node-images.component.scss',
})
export class NodeImagesComponent {
  @Input() imageUrls?: string[];
  @Input() shownInTableCell = true;
  @Input() useViewer = true;
  @Input() imageLabel?: string;

  onImageLoadError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = Settings.ui.imageForWhenLoadingFails;
  }
}

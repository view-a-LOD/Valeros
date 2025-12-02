import { NgComponentOutlet } from '@angular/common';
import {
  Component,
  ElementRef,
  Renderer2,
  Type,
  ViewChild,
} from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { featherInfo } from '@ng-icons/feather-icons';
import { TranslatePipe } from '@ngx-translate/core';
import { CustomSearchTipsComponent } from '../../../../_custom-components/custom-search-tips/custom-search-tips.directive';
import { Settings } from '../../../../config/settings';

@Component({
  selector: 'app-search-tips',
  standalone: true,
  imports: [NgComponentOutlet, TranslatePipe, NgIcon],
  templateUrl: './search-tips.component.html',
  styleUrls: ['./search-tips.component.scss'],
})
export class SearchTipsComponent {
  @ViewChild('modal') modal: ElementRef<HTMLDialogElement> | undefined;
  @ViewChild('triggerButton') triggerButton:
    | ElementRef<HTMLButtonElement>
    | undefined;

  protected readonly featherInfo = featherInfo;

  searchTipsComponent?: Type<CustomSearchTipsComponent> =
    Settings.content.searchTipsComponent;

  constructor(private renderer: Renderer2) {}

  focusOnModalTitle() {
    const titleElement =
      this.modal?.nativeElement.querySelector('#search-tips-title');
    (titleElement as HTMLElement).focus();
  }

  openModal() {
    if (this.modal && this.triggerButton) {
      this.renderer.setAttribute(
        this.triggerButton.nativeElement,
        'aria-expanded',
        'true',
      );

      setTimeout(() => {
        this.focusOnModalTitle();
      }, 100);

      this.modal.nativeElement.addEventListener(
        'close',
        () => {
          this.renderer.setAttribute(
            this.triggerButton!.nativeElement,
            'aria-expanded',
            'false',
          );

          this.renderer.setAttribute(this.modal?.nativeElement, 'inert', '');
        },
        { once: true },
      );

      this.modal.nativeElement.showModal();

      this.renderer.removeAttribute(this.modal?.nativeElement, 'inert');
    }
  }
}

import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { BreakpointService } from '../breakpoint.service';

@Injectable({
  providedIn: 'root',
})
export class FilterDrawerService implements OnDestroy {
  // Desktop drawer state (keeps being shown or hidden)
  desktopExpanded$ = new BehaviorSubject<boolean>(true);

  // Mobile drawer state (overlay drawer controlled by checkbox)
  mobileIsOpen$ = new BehaviorSubject<boolean>(false);

  private _breakpointSubscription?: Subscription;

  constructor(private breakpoint: BreakpointService) {
    this.initBreakpointSync();
  }

  ngOnDestroy() {
    if (this._breakpointSubscription) {
      this._breakpointSubscription.unsubscribe();
    }
  }

  private initBreakpointSync() {
    this._breakpointSubscription = this.breakpoint.breakpoint$.subscribe(() => {
      if (this.breakpoint.isBreakpointOrLarger('lg')) {
        this.closeFilterDrawerMobile();
      }
    });
  }

  toggleFilterDrawerDesktop() {
    const shouldExpand = !this.desktopExpanded$.value;
    this.desktopExpanded$.next(shouldExpand);
    if (shouldExpand) {
      this.focusFilterPanel();
    }
  }

  toggleFilterDrawerMobile() {
    this._setFilterDrawerMobileState(!this.mobileIsOpen$.value);
  }

  closeFilterDrawerMobile() {
    this._setFilterDrawerMobileState(false);
  }

  openFilterDrawerMobile() {
    this._setFilterDrawerMobileState(true);
  }

  open() {
    if (this.breakpoint.isBreakpointOrLarger('lg')) {
      this.desktopExpanded$.next(true);
      this.focusFilterPanel();
    } else {
      this._setFilterDrawerMobileState(true);
    }
  }

  isOpen(): boolean {
    if (this.breakpoint.isBreakpointOrLarger('lg')) {
      return this.desktopExpanded$.value;
    } else {
      return this.mobileIsOpen$.value;
    }
  }

  updateFromCheckbox(checked: boolean) {
    this.mobileIsOpen$.next(checked);
  }

  private _setFilterDrawerMobileState(isOpen: boolean) {
    this.mobileIsOpen$.next(isOpen);
    const checkbox = document.getElementById(
      'filter-drawer-checkbox',
    ) as HTMLInputElement;
    if (checkbox) {
      checkbox.checked = isOpen;
    }
    if (isOpen) {
      this.focusFilterPanel();
    }
  }

  focusFilterPanel() {
    setTimeout(() => {
      const element = document.getElementById('filter-panel');
      if (element) {
        element.setAttribute('tabindex', '-1');
        element.focus();
      }
    }, 100);
  }
}

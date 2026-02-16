import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ViewMode } from '../models/view-mode.enum';
import { BreakpointService } from './breakpoint.service';

@Injectable({
  providedIn: 'root',
})
export class ViewModeService implements OnDestroy {
  current: BehaviorSubject<ViewMode> = new BehaviorSubject<ViewMode>(
    ViewMode.List,
  );
  private breakpointSubscription: Subscription;

  constructor(public breakpoint: BreakpointService) {
    this.breakpointSubscription = this.breakpoint.breakpoint$.subscribe(() => {
      if (!this.breakpoint.isBreakpointOrLarger('md')) {
        this.current.next(ViewMode.List);
      }
    });
  }

  ngOnDestroy() {
    if (this.breakpointSubscription) {
      this.breakpointSubscription.unsubscribe();
    }
  }
}

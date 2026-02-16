import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, fromEvent, Subscription } from 'rxjs';
import { debounceTime, startWith } from 'rxjs/operators';

export const TAILWIND_BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export type Breakpoint = keyof typeof TAILWIND_BREAKPOINTS | 'xs';

export const BREAKPOINT_ORDER: Breakpoint[] = [
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  '2xl',
];

@Injectable({
  providedIn: 'root',
})
export class BreakpointService implements OnDestroy {
  private breakpointSubject = new BehaviorSubject<Breakpoint>(
    this.getBreakpoint(window.innerWidth),
  );
  public breakpoint$ = this.breakpointSubject.asObservable();
  private resizeSubscription: Subscription;

  constructor() {
    this.resizeSubscription = fromEvent(window, 'resize')
      .pipe(debounceTime(100), startWith(null))
      .subscribe(() => {
        const newBreakpoint = this.getBreakpoint(window.innerWidth);
        if (newBreakpoint !== this.breakpointSubject.value) {
          this.breakpointSubject.next(newBreakpoint);
        }
      });
  }

  private getBreakpoint(width: number): Breakpoint {
    if (width < TAILWIND_BREAKPOINTS.sm) {
      return 'xs';
    } else if (width < TAILWIND_BREAKPOINTS.md) {
      return 'sm';
    } else if (width < TAILWIND_BREAKPOINTS.lg) {
      return 'md';
    } else if (width < TAILWIND_BREAKPOINTS.xl) {
      return 'lg';
    } else if (width < TAILWIND_BREAKPOINTS['2xl']) {
      return 'xl';
    } else {
      return '2xl';
    }
  }

  public isBreakpoint(breakpoint: Breakpoint): boolean {
    return this.breakpointSubject.value === breakpoint;
  }

  public isBreakpointOrLarger(breakpoint: Breakpoint): boolean {
    const currentBreakpoint = this.breakpointSubject.value;
    const currentIndex = BREAKPOINT_ORDER.indexOf(currentBreakpoint);
    const targetIndex = BREAKPOINT_ORDER.indexOf(breakpoint);
    return currentIndex >= targetIndex;
  }

  ngOnDestroy() {
    if (this.resizeSubscription) {
      this.resizeSubscription.unsubscribe();
    }
  }
}

import {
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: 'ng-icon[accessible]',
  standalone: true, // Standalone directive
})
export class AccessibleIconDirective implements OnDestroy {
  @Input()
  role!: string;
  @Input()
  accessibilityLabelledBy!: string;
  @Input()
  accessibilityLabel!: string;

  private observer: MutationObserver;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {
    // Initialize the MutationObserver
    this.observer = new MutationObserver(() => {
      this.applyAttributes();
    });
  }

  ngOnInit() {
    // Start observing changes in the ng-icon's DOM
    this.observer.observe(this.el.nativeElement, {
      childList: true, // Watch for added/removed child nodes
      subtree: true, // Watch for changes to child elements
    });

    // Apply attributes immediately in case the SVG already exists
    this.applyAttributes();
  }

  private applyAttributes() {
    const svg = this.el.nativeElement.querySelector('svg');
    if (svg) {
      if (this.role) this.renderer.setAttribute(svg, 'role', this.role);
      if (this.accessibilityLabelledBy)
        this.renderer.setAttribute(
          svg,
          'aria-labelledby',
          this.accessibilityLabelledBy,
        );
      if (this.accessibilityLabel)
        this.renderer.setAttribute(svg, 'aria-label', this.accessibilityLabel);
    }
  }

  ngOnDestroy() {
    // Disconnect the MutationObserver to prevent memory leaks
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

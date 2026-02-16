import { Component, type OnInit } from '@angular/core';
import { AriaLiveService } from '../../../services/accessibility/aria-live.service';

@Component({
  selector: 'app-aria-live',
  imports: [],
  templateUrl: './aria-live.component.html',
})
export class AriaLiveComponent implements OnInit {
  constructor(public ariaLive: AriaLiveService) {}

  ngOnInit(): void {}
}

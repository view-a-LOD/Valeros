import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { PredicateRenderComponent } from '../predicate-render-component.directive';

@Component({
  selector: 'app-iso-8601-date',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './iso-8601-date.component.html',
})
export class Iso8601DateComponent extends PredicateRenderComponent {
  private _pad2(value: number): string {
    return value.toString().padStart(2, '0');
  }

  get dateTimeLocalValue(): string {
    const rawValue = this.data?.value;
    if (!rawValue) {
      return '';
    }

    const date = new Date(rawValue);
    if (Number.isNaN(date.getTime())) {
      return '';
    }

    const year = date.getFullYear();
    const month = this._pad2(date.getMonth() + 1);
    const day = this._pad2(date.getDate());
    const hours = this._pad2(date.getHours());
    const minutes = this._pad2(date.getMinutes());

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
}

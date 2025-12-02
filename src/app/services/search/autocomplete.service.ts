import { Injectable } from '@angular/core';
import { BehaviorSubject, debounceTime, Subject } from 'rxjs';
import {
  AutocompleteOptionModel,
  AutocompleteOptionType,
} from '../../models/autocomplete-option.model';
import {
  AutocompleteProvider,
  AutocompleteRequest,
  AutocompleteResponse,
} from './autocomplete-providers/autocomplete-provider.interface';

@Injectable({
  providedIn: 'root',
})
export class AutocompleteService {
  searchSubject: Subject<string> = new Subject();
  options: BehaviorSubject<AutocompleteOptionModel[]> = new BehaviorSubject<
    AutocompleteOptionModel[]
  >([]);
  isLoading = false;

  constructor(private provider: AutocompleteProvider) {
    this._initDebouncedOptionsRetrieval();
  }

  hasOptionsOfType(type: AutocompleteOptionType): boolean {
    return this.getOptionsByType(type).length > 0;
  }

  getOptionsByType(type: AutocompleteOptionType): AutocompleteOptionModel[] {
    return this.options.value.filter((option) => option.type === type);
  }

  clearOptions() {
    this.options.next([]);
  }

  private _initDebouncedOptionsRetrieval() {
    this.searchSubject.pipe(debounceTime(300)).subscribe(async (input) => {
      const options: AutocompleteOptionModel[] = await this._getOptions(input);
      this.options.next(options);
    });
  }

  private async _getOptions(
    searchInput: string,
  ): Promise<AutocompleteOptionModel[]> {
    if (!searchInput) {
      return [];
    }

    this.isLoading = true;

    const request: AutocompleteRequest = { term: searchInput };
    const response: AutocompleteResponse =
      await this.provider.getOptions(request);

    this.isLoading = false;

    return response.options;
  }
}

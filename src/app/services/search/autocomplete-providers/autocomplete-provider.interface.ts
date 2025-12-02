import { AutocompleteOptionModel } from '../../../models/autocomplete-option.model';

export interface AutocompleteRequest {
  term: string;
}

export interface AutocompleteResponse {
  options: AutocompleteOptionModel[];
}

export abstract class AutocompleteProvider {
  abstract getOptions(
    request: AutocompleteRequest,
  ): Promise<AutocompleteResponse>;
}

import { RazuSearchTipsComponent } from '../../../components/features/search/search-tips/custom-search-tips/razu-search-tips/razu-search-tips.component';
import { RazuColophonComponent } from '../../../components/views/colophon/custom-colophons/razu-colophon/razu-colophon.component';
import { ContentSettings } from '../../../models/settings/content-settings.model';

export const razuContentSettings: ContentSettings = {
  translations: {
    basePath: './assets/i18n/razu/',
    fileExtension: '.json',
  },
  searchTipsComponent: RazuSearchTipsComponent,
  colophonComponent: RazuColophonComponent,
  sparqlLanguageFilterForLiterals: ['nl', 'nl-nl', 'en', 'en-us'],
};

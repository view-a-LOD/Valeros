import { HeaderPosition } from '../../../models/settings/header-settings.model';
import { UiSettings } from '../../../models/settings/ui-settings.model';

export const uiSettings: UiSettings = {
  showLanguageToggle: false,
  labelMaxChars: 100,
  sectionNextToTableWidth: { search: '30%', details: '40%' },
  imageForWhenLoadingFails: '/assets/img/image-load-fail.png',
  imageForWhenImageIsInaccessible: '/assets/img/image-inaccessible.png',
  showViewModeSelect: true,
  minNumParentsToAllowTreeExpand: 3,
  objValues: {
    numToShowByDefault: 5,
    additionalNumToShowOnClick: 5,
  },
  filterOptions: {
    numToShowByDefault: 5,
    additionalNumToShowOnClick: 10,
  },
  labelFetchIntervalMs: 100,
  header: {
    showLogo: true,
    showTitle: true,
    showColophonButton: false,
    logoPath: '/assets/img/home-logo.svg',
    position: HeaderPosition.Center,
  },
};

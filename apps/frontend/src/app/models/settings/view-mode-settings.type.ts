import { ViewMode } from '../view-mode.enum';
import { ViewModeSetting } from './view-mode-setting.enum';

export type ViewModeSettings = {
  [v in ViewMode]: { [s in ViewModeSetting]: boolean };
};

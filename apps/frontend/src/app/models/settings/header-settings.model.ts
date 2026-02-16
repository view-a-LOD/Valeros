export enum HeaderPosition {
  Left = 'left',
  Center = 'center',
  Right = 'right',
}

export interface HeaderSettings {
  showLogo: boolean;
  showTitle: boolean;
  showColophonButton: boolean;
  logoPath: string;
  position: HeaderPosition;
}

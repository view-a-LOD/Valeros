import daisyuiBase from 'daisyui/src/theming/themes';
import { ThemeSettings } from '../models/settings/theme-settings.model';

export const developmentTheme: ThemeSettings = {
  ...daisyuiBase['light'],
  primary: '#2f88a6',
  neutral: '#808080',
  accent: '#b3b3b3',
  secondary: '#6d6d6d',
  background: '#edf6fa',
  'base-200': '#dceaef',
  '--rounded-box': '0.5rem',
  '--rounded-btn': '0.5rem',
  '--rounded-badge': '0.5rem',
  'primary-content': 'white',
};

export const acceptanceTheme: ThemeSettings = {
  ...daisyuiBase['light'],
  primary: '#2e7d32',
  neutral: '#66bb6a',
  accent: '#a5d6a7',
  secondary: '#388e3c',
  background: '#e8f5e9',
  'base-200': '#e4e4e7',
  '--rounded-box': '1rem',
  '--rounded-btn': '1rem',
  '--rounded-badge': '1rem',
  'primary-content': 'white',
};

export const productionTheme: ThemeSettings = {
  ...daisyuiBase['light'],
  primary: '#6c5a82',
  neutral: '#a999bd',
  accent: '#9ad199',
  secondary: '#c2b280',
  background: '#E5E4E2',
  'base-200': '#e4e4e7',
  '--rounded-box': '0.375rem',
  '--rounded-btn': '0.375rem',
  '--rounded-badge': '0.375rem',
  'primary-content': 'white',
};

export const testTheme: ThemeSettings = {
  ...daisyuiBase['light'],
  primary: '#1565c0',
  neutral: '#42a5f5',
  accent: '#90caf9',
  secondary: '#1976d2',
  background: '#e3f2fd',
  'base-200': '#e4e4e7',
  '--rounded-box': '0.375rem',
  '--rounded-btn': '0.375rem',
  '--rounded-badge': '0.375rem',
  'primary-content': 'white',
};

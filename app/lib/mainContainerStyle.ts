import { CSSProperties } from 'react';
import { NAV_BAR_HEIGHT } from './constants';

export const mainContainerStyle: CSSProperties = {
  height: `calc(100vh - ${NAV_BAR_HEIGHT})`,
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
};

import React from 'react';

export interface MapModalTooltipContextValue {
  openModalTooltip: (_: any) => void,
  onRequestClose: () => void,
}

const MapModalTooltipContext = React.createContext<MapModalTooltipContextValue>({
  openModalTooltip: (_: any) => {
  },
  onRequestClose: () => {
  },
});

MapModalTooltipContext.displayName = 'MapModalTooltipContext';

export default MapModalTooltipContext;

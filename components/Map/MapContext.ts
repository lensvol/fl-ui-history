import React from 'react';
import { IArea } from "types/map";

export type MapContextValue = {
  isGateStoryletModalOpen: boolean,
  onRequestOpenGateStoryletModal: (area: IArea) => void,
  onRequestCloseGateStoryletModal: () => void,
};

export const MapContext = React.createContext<MapContextValue>({
  isGateStoryletModalOpen: false,
  onRequestOpenGateStoryletModal: (_: IArea) => {
  },
  onRequestCloseGateStoryletModal: () => {},
});

MapContext.displayName = 'MapContext';

export default MapContext;
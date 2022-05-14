import React from 'react';
import { IArea } from 'types/map';

export interface SelectedAreaContextValue {
  selectedArea?: IArea,
}

export const SelectedAreaContext = React.createContext<SelectedAreaContextValue>({
  selectedArea: undefined,
});

SelectedAreaContext.displayName = 'SelectedAreaContext';

export default SelectedAreaContext;
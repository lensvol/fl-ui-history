import React from 'react';
import { ICategory } from 'types/possessions';

export interface PossessionsContextValue {
  categories: ICategory[],
  currentlyInStorylet: boolean,
  filterString: string,
  onFilter: (_: any) => void,
}

const PossessionsContext = React.createContext<PossessionsContextValue>({
  categories: [],
  currentlyInStorylet: false,
  filterString: '',
  onFilter: (_) => {},
});

PossessionsContext.displayName = 'PossessionsContext';

export default PossessionsContext;
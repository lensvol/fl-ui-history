import React from 'react';

export type DeckRefreshContextValue = {
  onOpenDeckRefreshModal: () => void,
};

const DeckRefreshContext = React.createContext<DeckRefreshContextValue>({
  onOpenDeckRefreshModal: () => {
    console.warn('DeckRefreshContext.onOpenDeckRefreshModal is falling back to default');
  },
});
DeckRefreshContext.displayName = 'DeckRefreshContext';

export default DeckRefreshContext;

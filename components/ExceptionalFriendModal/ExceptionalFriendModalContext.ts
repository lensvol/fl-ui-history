import React from 'react';

const ExceptionalFriendModalContext = React.createContext({
  openModal: (arg?: any) => {},
  onRequestClose: (arg?: any) => {},
});

ExceptionalFriendModalContext.displayName = 'ExceptionalFriendModalContext';

export default ExceptionalFriendModalContext;
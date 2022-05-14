import React from 'react';

import Loading from 'components/Loading';

export default function LoadingScreen({ children }: { children?: React.ReactNode}) {
  return (
    <div
      style={{
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'absolute',
        height: '100vh',
        width: '100vw',
        top: '0',
        left: '0',
      }}
    >
      <Loading spinner />
      {children}
    </div>
  );
}

LoadingScreen.displayName = 'LoadingScreen';

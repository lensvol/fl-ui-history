import React from 'react';

import Config from 'configuration';

export default function CompatibilityWarning() {
  if (!(Config.environment === 'local' || Config.environment === 'staging')) {
    return null;
  }
  return (
    <div
      style={{
        color: 'red',
        fontSize: '24px',
        padding: '4px',
        pointerEvents: 'none',
        position: 'absolute',
        top: 0,
        right: 0,
        zIndex: 1000000,
      }}
    >
      FALLBACK
    </div>
  );
}

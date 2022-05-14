import React from 'react';

import Buttonlet from 'components/Buttonlet';

export default function RefreshButtonlet({ onClick }) {
  return (
    <Buttonlet
      type="refresh"
      title="Restart this plan"
      onClick={onClick}
    />
  );
}
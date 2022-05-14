import React from 'react';

export default function Subtitle({ isFree, isSuccess }: { isFree: boolean, isSuccess: boolean }) {
  return (
    <h3 className="heading heading--3 heading--inverse">
      {(isSuccess && !isFree) ? 'Fate deducted.' : 'No Fate has been deducted.'}
    </h3>
  );
}

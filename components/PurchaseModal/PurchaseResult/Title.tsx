import React from 'react';

export default function Title({ isSuccess }: { isSuccess: boolean }) {
  return (
    <h2 className="heading heading--2 heading--inverse media__heading">
      {isSuccess ? 'Purchase Success!' : 'Purchase Failure.'}
    </h2>
  );
}

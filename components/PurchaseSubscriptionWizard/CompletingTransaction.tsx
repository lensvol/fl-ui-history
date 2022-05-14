import Loading from 'components/Loading';
import React from 'react';

export default function CompletingTransaction() {
  return (
    <div>
      <h1 className="heading heading--3">
        Completing your transaction
      </h1>
      <Loading
        spinner
      />
    </div>
  );
}
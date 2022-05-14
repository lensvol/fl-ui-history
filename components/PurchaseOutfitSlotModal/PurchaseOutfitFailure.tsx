import classnames from 'classnames';
import React from 'react';

export default function PurchaseOutfitFailure({
  message,
  onReset,
}: Props) {
  return (
    <>
      <h1
        className={classnames("purchase-outfit-slot-modal__header")}
      >
        Purchase Failure
      </h1>
      <p>
        Something went wrong.
      </p>
      {message && (
        <p>
          {message}
        </p>
      )}
      <div>
        <button className="button button--primary" onClick={onReset}>
          Try again
        </button>
      </div>
    </>
  );
}

type Props = {
  message: string | undefined,
  onReset: () => void,
};

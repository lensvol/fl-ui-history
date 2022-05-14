import React from 'react';
import PurchaseFateContext from 'components/GeneralContainer/PurchaseFateContext';

export default function NotEnoughFateWarning({
  currentFate,
  isFree,
  fateCost,
}: Props) {
  if (isFree) {
    return null;
  }

  if (currentFate >= fateCost) {
    return (
      <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
        <span>
          {`Changing your face costs ${fateCost} Fate.`}
        </span>
      </div>
    );
  }

  return (
    <PurchaseFateContext.Consumer>
      {({ onOpenPurchaseFateModal }) => (
        <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
          <span>
            {`Changing your face costs ${fateCost} Fate; you have ${currentFate}.`}
          </span>
          <button
            className="button button--secondary"
            onClick={onOpenPurchaseFateModal}
            type="button"
          >
            Buy Fate
          </button>
        </div>
      )}
    </PurchaseFateContext.Consumer>
  );
}

type Props = {
  currentFate: number,
  fateCost: number,
  isFree: boolean,
};

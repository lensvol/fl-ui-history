import React from 'react';

import Loading from 'components/Loading';
import { NexQuantity } from 'types/payment';
import FateOption from '../../FateOption';

export default function Packages({
  isBreakdownVisible,
  isFetching,
  packages,
  onSelect,
  selectedPackage,
}: Props) {
  if (isFetching) {
    return (
      <div style={{ paddingTop: 24, display: 'flex', justifyContent: 'center' }}>
        <Loading spinner />
      </div>
    );
  }

  return (
    <>
      {packages.map((item, i) => {
        const isSelected = !!selectedPackage && selectedPackage.currency === item.currency;
        return (
          <FateOption
            key={item.quantity}
            data={item}
            id={i}
            isBreakdownVisible={isBreakdownVisible}
            isSelected={isSelected}
            onSelect={onSelect}
          />
        );
      })}
    </>
  );
}

Packages.displayName = 'Packages';

type Props = {
  isBreakdownVisible: boolean,
  isFetching: boolean,
  onSelect: (_args?: any) => void,
  packages: NexQuantity[],
  selectedPackage: any,
};

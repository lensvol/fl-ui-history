import React from 'react';
import Echoes from 'components/QualityValue/components/Echoes';
import { IQuality } from 'types/qualities';
import QualityRequirement from '../QualityRequirement';

type Props = {
  isCurrency: boolean,
  quality?: IQuality,
  invert?: boolean,
  value: number,
};

export default function QualityValue(props: Props) {
  const {
    invert,
    isCurrency,
    quality,
    value,
  } = props;

  const purchaseIsCurrency = isCurrency;

  const purchaseQualityValues = purchaseIsCurrency ? null : { ...quality };

  const qualityImage = purchaseQualityValues
    ? <QualityRequirement data={purchaseQualityValues} tooltipPos="right" type="purchase" key={0} />
    : null;

  if (!purchaseIsCurrency) {
    return (
      <div>
        {qualityImage}
        <span>
          {value}
          {' '}
          x
          {' '}
          {quality?.name}
        </span>
      </div>
    );
  }

  return <Echoes key={1} value={value} invert={invert ?? false} />;
}

QualityValue.displayName = 'QualityValue';

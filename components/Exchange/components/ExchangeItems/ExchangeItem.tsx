import React, {
  useCallback,
  useMemo,
} from 'react';
import classnames from 'classnames';

import { QUALITY_ID_PENNY } from 'constants/possessions';
import Image from 'components/Image';
import QualityValue from 'components/QualityValue';
import { IAvailability } from 'types/exchange';
import { ExchangeContextValue } from 'components/Exchange/ExchangeContext';
import { createEquipmentQualityAltText } from 'utils';
import buildTooltipData from '../buildTooltipData';

type Props = Pick<ExchangeContextValue, 'onStartTransaction'> & {
  data: IAvailability,
  quantity: number,
}

export default function ExchangeItem({
  data,
  onStartTransaction,
  quantity,
}: Props) {
  const { forSale, availability } = data;
  const {
    purchaseQuality,
    quality,
  } = availability;
  const purchaseIsCurrency = purchaseQuality.id === QUALITY_ID_PENNY;

  const onClick = useCallback(() => onStartTransaction(data), [
    data,
    onStartTransaction,
  ]);

  const altText = useMemo(() => createEquipmentQualityAltText({
    description: quality.description,
    enhancements: quality.enhancements,
    name: quality.name,
  }), [
    quality.description,
    quality.enhancements,
    quality.name,
  ]);

  return (
    <li
      className={classnames(
        'shop__item js-item item',
        !purchaseIsCurrency && 'extra-padding',
      )}
      data-quality-id={quality.id}
    >
      <div className="js-icon icon js-tt icon--inventory icon--emphasize">
        <Image
          defaultCursor
          icon={quality.image}
          alt={altText}
          type="small-icon"
          tooltipData={buildTooltipData(quality)}
          tooltipPos="right"
        />
        {quantity > 0 && (
          <span className="js-item-value icon__value">
            {quantity}
          </span>
        )}
      </div>
      <div className="item__desc">
        <span className="js-item-name item__name">
          {quality.name}
        </span>
        <QualityValue
          isCurrency={purchaseIsCurrency}
          quality={purchaseQuality}
          value={forSale ? data.availability.cost : data.availability.sellPrice}
        />
      </div>
      <div className="js-item-controls item__controls">
        <button
          className="button button--primary button--sm js-bazaar-sell"
          onClick={onClick}
          type="button"
        >
          {forSale ? 'Buy' : 'Sell'}
        </button>
      </div>
    </li>
  );
}

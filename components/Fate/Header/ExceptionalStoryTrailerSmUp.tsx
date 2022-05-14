import React from 'react';

import Image from 'components/Image';
import { Props } from './props';

export default function ExceptionalStoryTrailerSmUp({ data }: Props) {
  return (
    <div className="premium-sub-purchase-card">
      <div className="premium-sub-purchase-card__left">
        <Image
          borderContainerClassName="premium-sub-purchase-card__border"
          className="premium-sub-purchase-card__image"
          icon={data.premiumSubPurchaseCard.image}
          alt="Become an Exceptional Friend of the Bazaar"
          border="Premium"
          type="icon"
        />
      </div>
      <div className="premium-sub-purchase-card__body">
        <div className="">
          <h2 className="heading heading--2 premium-sub-purchase-card__title">
            {data.premiumSubPurchaseCard.name}
          </h2>
          <p className="premium-sub-purchase-card__description">
            {data.premiumSubPurchaseCard.description}
          </p>
        </div>
      </div>
    </div>
  );
}
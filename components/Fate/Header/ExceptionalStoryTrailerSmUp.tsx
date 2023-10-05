import React from "react";

import Image from "components/Image";
import { Props } from "./props";
import { useFeature } from "flagged";
import { FEATURE_ENHANCED_EF } from "features/feature-flags";

export default function ExceptionalStoryTrailerSmUp({ data }: Props) {
  const supportsEnhancedEF = useFeature(FEATURE_ENHANCED_EF);

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
          {supportsEnhancedEF && (
            <>
              <p className="premium-sub-purchase-card__description">
                <strong>
                  <em>
                    This month's Exceptional Story is included in all
                    subscriptions.
                  </em>
                </strong>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

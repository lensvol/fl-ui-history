import React from "react";

import MediaSmUp from "components/Responsive/MediaSmUp";
import MediaXsDown from "components/Responsive/MediaXsDown";
import Subscription from "../Subscription";
import ExceptionalStoryTrailerSmUp from "./ExceptionalStoryTrailerSmUp";
import ExceptionalStoryTrailerXsDown from "./ExceptionalStoryTrailerXsDown";
import { Props } from "./props";
import SubscriptionBenefits from "components/PurchaseSubscriptionWizard/SubscriptionBenefits";

export default function Header({
  onClick,
  data,
  concealStoryTrailerOnSmallDevices,
}: Props) {
  return (
    <div key="content fate-header">
      <h1 className="media__heading heading heading--2">
        Become an Exceptional Friend of the Bazaar
      </h1>

      <SubscriptionBenefits />

      {data.premiumSubPurchaseCard && (
        <>
          <MediaSmUp>
            <ExceptionalStoryTrailerSmUp data={data} />
          </MediaSmUp>
          <MediaXsDown>
            {!concealStoryTrailerOnSmallDevices && (
              <ExceptionalStoryTrailerXsDown data={data} />
            )}
          </MediaXsDown>
        </>
      )}

      <div className="fate-header__subscription-container">
        <Subscription onClick={onClick} />
      </div>
    </div>
  );
}

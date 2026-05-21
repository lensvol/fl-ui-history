import React from "react";

import { isDowngradedSubscription } from "actions/fate/subscriptions";

import Disclosure from "components/Disclosure";
import ExceptionalStoryTrailerSmUp from "components/Fate/Header/ExceptionalStoryTrailerSmUp";
import ExceptionalStoryTrailerXsDown from "components/Fate/Header/ExceptionalStoryTrailerXsDown";
import { Props as TrailerProps } from "components/Fate/Header/props";
import Subscription from "components/Fate/Subscription";
import StoryletMenu from "components/Fate/Subscription/StoryletMenu";
import SubscriptionBenefits from "components/PurchaseSubscriptionWizard/SubscriptionBenefits";
import MediaSmUp from "components/Responsive/MediaSmUp";
import MediaXsDown from "components/Responsive/MediaXsDown";

type Props = TrailerProps & {
  hasSubscription: boolean;
  renewDate?: string;
};

export default function FateHeader({
  concealStoryTrailerOnSmallDevices,
  data,
  hasSubscription,
  onClick,
  renewDate,
  subscriptionType,
}: Props) {
  const userDidDowngrade = isDowngradedSubscription(
    hasSubscription,
    subscriptionType
  );

  const heading =
    subscriptionType === "EnhancedExceptionalFriendship"
      ? ""
      : userDidDowngrade || subscriptionType === "ExceptionalFriendship"
        ? "Become an Enhanced Exceptional Friend"
        : "Become an Exceptional Friend of the Bazaar";

  return (
    <div key="content fate-header">
      <MediaSmUp>
        {subscriptionType !== "EnhancedExceptionalFriendship" && (
          <h1 className="media__heading heading heading--2">{heading}</h1>
        )}

        <SubscriptionBenefits orientation="horizontal" />
      </MediaSmUp>
      <MediaXsDown>
        <Disclosure getDisclosureText={() => "Exceptional Friendship"}>
          {subscriptionType !== "EnhancedExceptionalFriendship" && (
            <h1 className="media__heading heading heading--2">{heading}</h1>
          )}

          <SubscriptionBenefits orientation="horizontal" />
        </Disclosure>
      </MediaXsDown>

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

      <StoryletMenu />

      <div className="fate-header__subscription-container">
        <Subscription
          hasSubscription={hasSubscription}
          onClick={onClick}
          renewDate={renewDate}
          subscriptionType={subscriptionType}
        />
      </div>
    </div>
  );
}

FateHeader.displayName = "FateHeader";

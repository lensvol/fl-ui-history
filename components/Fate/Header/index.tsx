import React from "react";

import Disclosure from "components/Disclosure";
import MediaSmUp from "components/Responsive/MediaSmUp";
import MediaXsDown from "components/Responsive/MediaXsDown";
import Subscription from "../Subscription";
import ExceptionalStoryTrailerSmUp from "./ExceptionalStoryTrailerSmUp";
import ExceptionalStoryTrailerXsDown from "./ExceptionalStoryTrailerXsDown";
import { Props as TrailerProps } from "./props";
import SubscriptionBenefits from "components/PurchaseSubscriptionWizard/SubscriptionBenefits";
import StoryletMenu from "../Subscription/StoryletMenu";
import { isDowngradedSubscription } from "actions/fate/subscriptions";

type Props = TrailerProps & {
  hasSubscription: boolean;
  renewDate?: string;
};

export default function Header({
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
          <>
            <h1 className="media__heading heading heading--2">{heading}</h1>
          </>
        )}

        <SubscriptionBenefits orientation="horizontal" />
      </MediaSmUp>
      <MediaXsDown>
        <Disclosure getDisclosureText={() => "Exceptional Friendship"}>
          {subscriptionType !== "EnhancedExceptionalFriendship" && (
            <>
              <h1 className="media__heading heading heading--2">{heading}</h1>
            </>
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

      <StoryletMenu enhancedPlacement={false} />

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

import React, { useCallback, useEffect, useState } from "react";

import ReactCSSTransitionReplace from "react-css-transition-replace";

import { useDispatch } from "react-redux";

import { fetch as fetchFate } from "actions/fate";
import { isDowngradedSubscription } from "actions/fate/subscriptions";
import { fetch as fetchSubscription } from "actions/subscription";

import Loading from "components/Loading";
import PurchaseSubscriptionModal from "components/PurchaseSubscriptionModal";
import Storylet from "components/Storylet";

import { useAppSelector } from "features/app/store";

import getSortedVisibleFateCards from "selectors/fate/getSortedVisibleFateCards";

interface Props {
  enhancedPlacement?: boolean;
  isAccountView?: boolean;
}

export default function StoryletMenu({
  enhancedPlacement,
  isAccountView,
}: Props) {
  const dispatch = useDispatch();

  const data = useAppSelector((state) => state.subscription.data);
  const fateCards = useAppSelector((state) => getSortedVisibleFateCards(state));
  const hasSubscription = useAppSelector(
    (state) => state.settings.subscriptions.hasBraintreeSubscription
  );
  const renewDate = useAppSelector(
    (state) => state.subscription.data?.renewDate
  );
  const subscriptionType = useAppSelector(
    (state) => state.settings.subscriptions.subscriptionType
  );
  const isFetchingFate = useAppSelector((state) => state.fate.isFetching);

  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);

  const handleRequestCloseSubscriptionModal = useCallback(() => {
    setIsSubscriptionModalOpen(false);
  }, []);

  // Fetch subscription on load
  useEffect(() => {
    dispatch(fetchFate());
    dispatch(fetchSubscription());
  }, [dispatch]);

  const userDidDowngrade = isDowngradedSubscription(
    hasSubscription,
    subscriptionType
  );
  const isEnhanced =
    userDidDowngrade || subscriptionType === "EnhancedExceptionalFriendship";

  // Show spinner while we're loading
  if (!data || (isAccountView && isEnhanced && isFetchingFate)) {
    return <Loading spinner small />;
  }

  // Enhanced EF has different placement from other subscription types; this prevents the 'wrong' placement.
  if ((enhancedPlacement ?? false) !== isEnhanced) {
    return null;
  }

  const featuredCard = fateCards
    .filter((c) => c.enhancedFeaturedItem ?? false)
    .filter((c) => c.enhancedStoryAvailability === "FreshlyAdded")
    .find((c) => c);

  const isEnhancedStoryReset = featuredCard?.type === "ResetStory";

  const featuedTeaser = featuredCard
    ? "<p>" +
      "Our featured " +
      (isEnhancedStoryReset ? "replay" : "story") +
      " this month: <b>" +
      (isEnhancedStoryReset && featuredCard.name.startsWith("Reset ")
        ? featuredCard.name.slice(6)
        : featuredCard.name) +
      "</b></p>"
    : "";

  const pseudoStorylet: any = {
    id: 0,
    image: featuredCard?.image ?? "furtivehand",
    name: "Revisit Fallen London's Exceptional Stories",
    teaser:
      "$$OPEN_STORY_MENU$$" +
      "<p>" +
      "Each month, Enhanced Exceptional Friends can unlock a past story &ndash; " +
      "or reset two they've played before &ndash; from our rotating menu." +
      "</p>" +
      featuedTeaser,
    category: featuredCard?.border?.toLowerCase() ?? "Ongoing",
    qualityRequirements: [],
    buttonText: "Browse Stories",
    buttonClassNames: "button--ef",
  };

  return (
    <div className="fate-header__subscription-container">
      <ReactCSSTransitionReplace
        transitionName="fade-wait"
        transitionEnterTimeout={100}
        transitionLeaveTimeout={100}
      >
        <div>
          <Storylet data={pseudoStorylet} isAccountView={isAccountView} />
        </div>
      </ReactCSSTransitionReplace>

      <PurchaseSubscriptionModal
        hasSubscription={hasSubscription}
        isOpen={isSubscriptionModalOpen}
        onRequestClose={handleRequestCloseSubscriptionModal}
        renewDate={renewDate}
        subscriptionType={subscriptionType}
      />
    </div>
  );
}

StoryletMenu.displayName = "StoryletMenu";

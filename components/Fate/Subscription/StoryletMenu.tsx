import React, { useCallback, useEffect, useState } from "react";

import ReactCSSTransitionReplace from "react-css-transition-replace";

import { connect, useDispatch } from "react-redux";

import { withRouter, RouteComponentProps } from "react-router-dom";

import { fetch as fetchFate } from "actions/fate";
import { isDowngradedSubscription } from "actions/fate/subscriptions";
import { fetch as fetchSubscriptions } from "actions/subscription";

import Loading from "components/Loading";
import PurchaseSubscriptionModal from "components/PurchaseSubscriptionModal";
import Storylet from "components/Storylet";

import getSortedVisibleFateCards from "selectors/fate/getSortedVisibleFateCards";

import { IAppState } from "types/app";
import { IFateCard } from "types/fate";
import { ISubscriptionData, PremiumSubscriptionType } from "types/subscription";

export function StoryletMenu({
  data,
  enhancedPlacement,
  hasSubscription,
  renewDate,
  subscriptionType,
  fateCards,
}: Props) {
  const dispatch = useDispatch();

  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);

  const handleRequestCloseSubscriptionModal = useCallback(() => {
    setIsSubscriptionModalOpen(false);
  }, []);

  // Fetch subscription on load
  useEffect(() => {
    dispatch(fetchFate());
    dispatch(fetchSubscriptions());
  }, [dispatch]);

  // Show spinner while we're loading
  if (!data) {
    return <Loading spinner small />;
  }

  const userDidDowngrade = isDowngradedSubscription(
    hasSubscription,
    subscriptionType
  );
  const isEnhanced =
    userDidDowngrade || subscriptionType === "EnhancedExceptionalFriendship";

  // Enhanced EF has different placement from other subscription types; this prevents the 'wrong' placement.
  if (enhancedPlacement !== isEnhanced) {
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
          <Storylet data={pseudoStorylet} />
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

interface Props extends RouteComponentProps {
  data?: ISubscriptionData;
  dispatch: Function;
  enhancedPlacement: boolean;
  fateCards: IFateCard[];
  hasSubscription: boolean;
  history: any;
  renewDate?: string;
  subscriptionType?: PremiumSubscriptionType;
}

const mapStateToProps = (state: IAppState) => ({
  data: state.subscription.data,
  hasSubscription: state.settings.subscriptions.hasBraintreeSubscription,
  renewDate: state.subscription.data?.renewDate,
  subscriptionType: state.settings.subscriptions.subscriptionType,
  fateCards: getSortedVisibleFateCards(state),
});

export default withRouter(connect(mapStateToProps)(StoryletMenu));

import React, { useCallback, useEffect, useState } from "react";

import ReactCSSTransitionReplace from "react-css-transition-replace";

import { useDispatch } from "react-redux";

import { fetch as fetchSubscription } from "actions/subscription";

import SubscriptionComponent from "components/Fate/Subscription/Subscription";
import PurchaseSubscriptionModal from "components/PurchaseSubscriptionModal";

import { PremiumSubscriptionType } from "types/subscription";

interface Props {
  hasSubscription: boolean;
  onClick?: () => void;
  renewDate?: string;
  showButtonOnly?: boolean;
  subscriptionType?: PremiumSubscriptionType;
}

export default function SubscriptionContainer({
  hasSubscription,
  onClick,
  renewDate,
  showButtonOnly,
  subscriptionType,
}: Props) {
  const dispatch = useDispatch();

  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);

  const handleClick = useCallback(() => {
    if (onClick) {
      onClick();

      return;
    }

    setIsSubscriptionModalOpen(true);
  }, [onClick]);

  const handleRequestCloseSubscriptionModal = useCallback(() => {
    setIsSubscriptionModalOpen(false);
  }, []);

  // Fetch subscription on load
  useEffect(() => {
    dispatch(fetchSubscription());
  }, [dispatch]);

  return (
    <>
      <ReactCSSTransitionReplace
        transitionEnterTimeout={100}
        transitionLeaveTimeout={100}
        transitionName="fade-wait"
      >
        <SubscriptionComponent
          onClick={handleClick}
          showButtonOnly={showButtonOnly}
        />
      </ReactCSSTransitionReplace>

      <PurchaseSubscriptionModal
        hasSubscription={hasSubscription}
        isOpen={isSubscriptionModalOpen}
        onRequestClose={handleRequestCloseSubscriptionModal}
        renewDate={renewDate}
        subscriptionType={subscriptionType}
      />
    </>
  );
}

SubscriptionContainer.displayName = "SubscriptionContainer";

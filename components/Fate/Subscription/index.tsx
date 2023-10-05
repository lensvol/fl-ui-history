import PurchaseSubscriptionModal from "components/PurchaseSubscriptionModal";
import React, { useCallback, useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import ReactCSSTransitionReplace from "react-css-transition-replace";

import * as SubscriptionActionCreators from "actions/subscription";

import SubscriptionComponent from "./Subscription";

import { PremiumSubscriptionType } from "types/subscription";

function SubscriptionContainer({
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
    dispatch(SubscriptionActionCreators.fetch());
  }, [dispatch]);

  return (
    <>
      <ReactCSSTransitionReplace
        transitionName="fade-wait"
        transitionEnterTimeout={100}
        transitionLeaveTimeout={100}
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

interface Props {
  hasSubscription: boolean;
  onClick?: () => void;
  renewDate?: string;
  showButtonOnly?: boolean;
  subscriptionType?: PremiumSubscriptionType;
}

export default connect()(SubscriptionContainer);

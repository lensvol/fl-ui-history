import React, { useCallback } from "react";

import { useDispatch } from "react-redux";

import { withRouter, RouteComponentProps } from "react-router-dom";

import { isDowngradedSubscription } from "actions/fate/subscriptions";
import { openDialog } from "actions/payment";

import Loading from "components/Loading";

import { useAppSelector } from "features/app/store";

import { PremiumSubscriptionType } from "types/subscription";

export function Subscription({
  onClick: onParentClick,
  showButtonOnly,
}: Props) {
  const dispatch = useDispatch();
  const hasSubscription = useAppSelector(
    (state) => state.settings.subscriptions.hasBraintreeSubscription
  );
  const subscriptionType = useAppSelector((state) =>
    state.subscription.data
      ? state.settings.subscriptions.subscriptionType
      : undefined
  );

  const onClick = useCallback(() => {
    if (onParentClick) {
      onParentClick();

      return;
    }

    dispatch(openDialog("subscribe"));
  }, [dispatch, onParentClick]);

  // Show spinner while we're loading
  if (!subscriptionType) {
    return <Loading spinner small />;
  }

  const userDidDowngrade = isDowngradedSubscription(
    hasSubscription,
    subscriptionType
  );
  const subType: PremiumSubscriptionType = userDidDowngrade
    ? "ExceptionalFriendship"
    : hasSubscription
      ? subscriptionType
      : "None";

  switch (subType) {
    case "EnhancedExceptionalFriendship":
      return (
        <>
          <div className="ef-buttons">
            <strong>
              You already have an{" "}
              <span className="enhanced-text">Enhanced</span> Exceptional
              Friendship subscription. Thanks for your support.
            </strong>
            <button
              type="button"
              className="button button--secondary"
              onClick={onClick}
            >
              Manage Your Subscriptions
            </button>
          </div>
        </>
      );

    case "ExceptionalFriendship":
      return showButtonOnly ? (
        <>
          <button
            type="button"
            className="button button--secondary"
            onClick={onClick}
          >
            Manage &amp; Enhance Your Subscriptions
          </button>
        </>
      ) : (
        <>
          <div className="ef-buttons">
            <strong>
              You already have an Exceptional Friendship subscription, but may{" "}
              <span className="enhanced-text">Enhance</span> it if you desire.
              Thanks for your support.
            </strong>
            <button
              type="button"
              className="button button--secondary"
              onClick={onClick}
            >
              Manage &amp; Enhance Your Subscriptions
            </button>
          </div>
        </>
      );

    default:
      return showButtonOnly ? (
        <>
          <button
            type="button"
            className="button button--secondary"
            onClick={onClick}
          >
            Subscribe
          </button>
        </>
      ) : (
        <>
          <div
            className="ef-buttons"
            style={{
              textAlign: "right",
            }}
          >
            <strong>Subscribe from just $9 a month</strong>
            <button
              type="button"
              className="button button--secondary"
              onClick={onClick}
            >
              Subscribe
            </button>
          </div>
        </>
      );
  }
}

Subscription.displayName = "Subscription";

interface Props extends RouteComponentProps {
  showButtonOnly?: boolean;
  subscriptionType?: PremiumSubscriptionType;
  onClick?: () => void;
}

export default withRouter(Subscription);

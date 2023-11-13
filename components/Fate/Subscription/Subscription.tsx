import React, { useCallback } from "react";
import { connect } from "react-redux";
import { withRouter, RouteComponentProps } from "react-router-dom";

import { openDialog } from "actions/payment";

import Loading from "components/Loading";
import { IAppState } from "types/app";
import { PremiumSubscriptionType } from "types/subscription";
import { useFeature } from "flagged";
import { FEATURE_ENHANCED_EF } from "features/feature-flags";
import { isDowngradedSubscription } from "actions/fate/subscriptions";

export function Subscription({
  hasSubscription,
  showButtonOnly,
  subscriptionType,
  dispatch,
  history,
  onClick: onParentClick,
}: Props) {
  const onClick = useCallback(() => {
    if (onParentClick) {
      onParentClick();

      return;
    }

    dispatch(openDialog("subscribe"));
  }, [dispatch, onParentClick]);

  const supportsEnhancedEF = useFeature(FEATURE_ENHANCED_EF);

  // Show spinner while we're loading
  if (!subscriptionType) {
    return <Loading spinner small />;
  }

  const handleOnClick = hasSubscription
    ? () => history.push("/account")
    : onClick;

  if (!supportsEnhancedEF) {
    return (
      <p className="buttons">
        <button
          type="button"
          className="button button--secondary"
          onClick={handleOnClick}
        >
          {hasSubscription ? <>Manage Your Subscriptions</> : <>Subscribe</>}
        </button>
        <strong>
          {hasSubscription ? (
            <>You are already an Exceptional Friend. Thanks for your support.</>
          ) : (
            <>Subscribe for just $9 a month</>
          )}
        </strong>
      </p>
    );
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
  hasSubscription: boolean;
  showButtonOnly?: boolean;
  subscriptionType?: PremiumSubscriptionType;
  dispatch: Function; // eslint-disable-line
  history: any;
  onClick?: () => void;
}

const mapStateToProps = (state: IAppState) => ({
  hasSubscription: state.settings.subscriptions.hasBraintreeSubscription,
  subscriptionType: state.subscription.data
    ? state.settings.subscriptions.subscriptionType
    : undefined,
});

export default withRouter(connect(mapStateToProps)(Subscription));

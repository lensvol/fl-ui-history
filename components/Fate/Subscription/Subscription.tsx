import React, { useCallback } from "react";
import { connect } from "react-redux";
import { withRouter, RouteComponentProps } from "react-router-dom";

import { openDialog } from "actions/payment";

import Loading from "components/Loading";
import { IAppState } from "types/app";
import { ISubscriptionData } from "types/subscription";

export function Subscription({
  data,
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

  // Show spinner while we're loading
  if (!data) {
    return <Loading spinner small />;
  }

  if (data.hasSubscription) {
    return (
      <p className="buttons">
        <button
          type="button"
          className="button button--secondary"
          onClick={() => history.push("/account")}
        >
          Manage Your Subscriptions
        </button>
        <strong>
          You are already an Exceptional Friend. Thanks for your support.
        </strong>
      </p>
    );
  }

  return (
    <p className="buttons">
      <button
        type="button"
        className="button button--secondary"
        onClick={onClick}
      >
        Subscribe
      </button>
      <strong>Subscribe for just $9 a month</strong>
    </p>
  );
}

Subscription.displayName = "Subscription";

interface Props extends RouteComponentProps {
  data?: ISubscriptionData;
  dispatch: Function; // eslint-disable-line
  history: any;
  onClick?: () => void;
}

const mapStateToProps = (state: IAppState) => ({
  data: state.subscription.data,
});

export default withRouter(connect(mapStateToProps)(Subscription));

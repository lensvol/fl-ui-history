import React, { useEffect, useMemo } from "react";
import { connect, useDispatch } from "react-redux";

import { useFeature } from "flagged";

import { fetch as fetchSettings } from "actions/settings";
import { fetch as fetchSubscription } from "actions/subscription";

import { FEATURE_ENHANCED_EF } from "features/feature-flags";

import Loading from "components/Loading";
import SubscriptionComponent from "components/Fate/Subscription/Subscription";

import { IAppState } from "types/app";

function HasSubscriptionContent({
  data,
  hasSubscription,
  isFetching,
  isFetchingSubscription,
  isModifying,
  loggedIn,
  onClick,
  onClickLegacy,
  subscriptionData,
  subscriptionType,
}: Props) {
  const supportsEnhancedEF = useFeature(FEATURE_ENHANCED_EF);
  const isEnhanced = subscriptionType === "EnhancedExceptionalFriendship";
  const renewDateAsDate = new Date(subscriptionData?.renewDate ?? "");

  const formattedPrice = useMemo(
    () =>
      new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: subscriptionData?.currencyIsoCode ?? "GBP",
      }).format(
        (subscriptionData?.price ?? 0) + (subscriptionData?.addOnPrice ?? 0)
      ),
    [subscriptionData]
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (!data) {
      dispatch(fetchSettings());
    }

    if (loggedIn) {
      dispatch(fetchSubscription());
    }
  }, [data, dispatch, loggedIn]);

  if (isFetchingSubscription || isFetching) {
    return (
      <div style={{ padding: 24 }}>
        <Loading spinner />
      </div>
    );
  }

  if (!hasSubscription || subscriptionData === undefined) {
    return <p>You have no subscriptions.</p>;
  }

  return (
    <div>
      <p>
        {supportsEnhancedEF ? (
          <>
            You currently have {isEnhanced ? <>an enhanced</> : <>a</>}{" "}
            subscription to Fallen London
          </>
        ) : (
          <>You are currently subscribed to Fallen London</>
        )}
        {subscriptionData?.subscriptionPastDue && (
          <>, but there was a problem with your latest payment</>
        )}
        .
      </p>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          margin: "1rem 0",
        }}
      >
        <div>
          <div
            style={{
              borderBottom: "solid 1px",
              marginBottom: "0.5rem",
              paddingBottom: "0.5rem",
            }}
          >
            Monthly payment amount:
          </div>
          <div
            style={{
              fontSize: "125%",
            }}
          >
            {formattedPrice}
          </div>
        </div>

        <div>
          <div
            style={{
              borderBottom: "solid 1px",
              marginBottom: "0.5rem",
              paddingBottom: "0.5rem",
            }}
          >
            {subscriptionData?.subscriptionPastDue ? (
              <>Subscription expiration date:</>
            ) : (
              <>Next renewal date:</>
            )}
          </div>
          <div
            style={{
              fontSize: "125%",
            }}
          >
            {renewDateAsDate.toLocaleDateString("en-gb", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
      </div>
      {supportsEnhancedEF && isEnhanced && (
        <>
          <p>
            You can cancel or downgrade your subscription at any time. By
            cancelling, you will no longer have a second action candle, expanded
            opportunity deck, additional outfits, or access to the House of
            Chimes. You will no longer receive a new Exceptional Story every
            month, nor have access to the menu of returning stories. You will no
            longer receive free action refreshes each month. You will still be
            able to spend Memories of a Tale in Mr Chimes' Lost &amp; Found.
          </p>
          <p>
            By downgrading to an Exceptional Friendship, you will continue to
            have a second action candle, expanded opportunity deck, additional
            outfits, and access to the House of Chimes. You will continue to
            receive a new Exceptional Story every month, but you will no longer
            have access to the menu of returning stories. You will no longer
            receive free action refreshes each month. You will still be able to
            spend Memories of a Tale in Mr Chimes' Lost &amp; Found.
          </p>
        </>
      )}
      {supportsEnhancedEF && !isEnhanced && (
        <>
          <p>
            You can cancel your subscription at any time. By cancelling, you
            will no longer have a second action candle, expanded opportunity
            deck, additional outfits, or access to the House of Chimes. You will
            no longer receive a new Exceptional Story every month. You will
            still be able to spend Memories of a Tale in Mr Chimes' Lost &amp;
            Found.
          </p>
        </>
      )}
      {!supportsEnhancedEF && (
        <>
          <p>
            You can cancel your subscription at any time. By cancelling your
            subscription, you will no longer have a second action candle,
            expanded opportunity deck, three additional outfits, or access to
            the House of Chimes. You will no longer receive a new Exceptional
            Story every month. You will still be able to spend Memories of a
            Tale in Mr Chimes' Lost &amp; Found.
          </p>
        </>
      )}
      {supportsEnhancedEF ? (
        <>
          <SubscriptionComponent onClick={onClick} />
        </>
      ) : (
        <>
          <button
            className="button button--primary button--no-margin"
            onClick={onClickLegacy}
            type="button"
          >
            {isModifying ? "cancelling..." : "Cancel subscription"}
          </button>
        </>
      )}
    </div>
  );
}

const mapStateToProps = ({
  settings: {
    data,
    subscriptions: {
      hasBraintreeSubscription: hasSubscription,
      subscriptionType,
    },
    isFetching,
  },
  subscription: {
    data: subscriptionData,
    isFetching: isFetchingSubscription,
    isModifying,
  },
  user: { loggedIn },
}: IAppState) => ({
  data,
  hasSubscription,
  isFetching,
  isFetchingSubscription,
  isModifying,
  loggedIn,
  subscriptionData,
  subscriptionType,
});

type Props = ReturnType<typeof mapStateToProps> & {
  onClick: () => void;
  onClickLegacy: () => void;
};

export default connect(mapStateToProps)(HasSubscriptionContent);

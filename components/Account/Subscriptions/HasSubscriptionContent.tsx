import React, { useEffect, useMemo } from "react";

import { useDispatch } from "react-redux";

import { fetch as fetchSettings } from "actions/settings";
import { fetch as fetchSubscription } from "actions/subscription";

import SubscriptionComponent from "components/Fate/Subscription/Subscription";
import Loading from "components/Loading";

import { useAppSelector } from "features/app/store";

type Props = {
  onClick: () => void;
};

export default function HasSubscriptionContent({ onClick }: Props) {
  const data = useAppSelector((state) => state.settings.data);
  const hasSubscription = useAppSelector(
    (state) => state.settings.subscriptions.hasBraintreeSubscription
  );
  const isFetching = useAppSelector((state) => state.settings.isFetching);
  const isFetchingSubscription = useAppSelector(
    (state) => state.subscription.isFetching
  );
  const loggedIn = useAppSelector((state) => state.user.loggedIn);
  const subscriptionData = useAppSelector((state) => state.subscription.data);
  const subscriptionType = useAppSelector(
    (state) => state.settings.subscriptions.subscriptionType
  );

  const isEnhanced = subscriptionType === "EnhancedExceptionalFriendship";
  const renewDateAsDate = new Date(subscriptionData?.renewDate ?? "");

  const formattedPrice = useMemo(
    () =>
      new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: subscriptionData?.currencyIsoCode ?? "GBP",
      }).format(
        (subscriptionData ? subscriptionData.price : 0) +
          (subscriptionData?.addOnPrice ?? 0)
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
      <div
        style={{
          padding: 24,
        }}
      >
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
        <>
          You currently have {isEnhanced ? <>an enhanced</> : <>a</>}{" "}
          subscription to Fallen London
        </>
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
      {isEnhanced && (
        <>
          <p>
            You can cancel or downgrade your subscription at any time. By
            cancelling, you will no longer have a second action candle, expanded
            opportunity deck, additional outfits, the ability to run two
            additional concurrent plots with Agents, or access to the House of
            Chimes. You will no longer receive a new Exceptional Story every
            month, nor have access to the menu of returning stories. You will no
            longer receive free action refreshes each month. You will still be
            able to spend Memories of a Tale in Mr Chimes' Lost &amp; Found.
          </p>
          <p>
            By downgrading to an Exceptional Friendship, you will continue to
            have a second action candle, expanded opportunity deck, your
            Exceptional outfits, and access to the House of Chimes. You will
            continue to receive a new Exceptional Story every month, but you
            will no longer have access to the menu of returning stories. You
            will lose the ability to run one of your two additional concurrent
            plots with Agents. You will no longer receive free action refreshes
            each month. You will no longer have access to your Enhanced
            Exceptional outfits. You will still be able to spend Memories of a
            Tale in Mr Chimes' Lost &amp; Found.
          </p>
        </>
      )}
      {!isEnhanced && (
        <>
          <p>
            You can cancel your subscription at any time. By cancelling, you
            will no longer have a second action candle, expanded opportunity
            deck, additional outfits, the ability to run an additional
            concurrent Plot with Agents, or access to the House of Chimes. You
            will no longer receive a new Exceptional Story every month. You will
            still be able to spend Memories of a Tale in Mr Chimes' Lost &amp;
            Found.
          </p>
        </>
      )}
      <SubscriptionComponent onClick={onClick} />
    </div>
  );
}

HasSubscriptionContent.displayName = "HasSubscriptionContent";

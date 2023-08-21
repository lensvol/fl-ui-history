import React, { useMemo } from "react";

import { ISubscriptionData } from "types/subscription";

export default function HasSubscriptionContent({
  data,
  isCancelling,
  onClick,
}: Props) {
  const {
    currencyIsoCode,
    price,
    renewDate,
    activeSubscriptionFailedToUpdate,
    subscriptionPastDue,
  } = data;

  const renewDateAsDate = new Date(renewDate);

  const formattedPrice = useMemo(
    () =>
      new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: currencyIsoCode,
      }).format(price),
    [currencyIsoCode, price]
  );

  return (
    <div>
      <p>
        You are currently subscribed to Fallen London
        {(activeSubscriptionFailedToUpdate || subscriptionPastDue) && (
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
            {activeSubscriptionFailedToUpdate || subscriptionPastDue ? (
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
      <p>
        You can cancel your subscription at any time. By cancelling your
        subscription, you will no longer have a second action candle, expanded
        opportunity deck, three additional outfits, or access to the House of
        Chimes. You will no longer receive a new Exceptional Story every month.
        You will still be able to spend Memories of a Tale in Mr Chimes' Lost
        &amp; Found.
      </p>
      <button
        className="button button--primary button--no-margin"
        onClick={onClick}
        type="button"
      >
        {isCancelling ? "cancelling..." : "Cancel subscription"}
      </button>
    </div>
  );
}

interface Props {
  data: ISubscriptionData;
  isCancelling: boolean;
  onClick: () => void;
}

import React, { useMemo } from "react";
import { Feature } from "flagged";

import { ISubscriptionData } from "types/subscription";
import { NEW_OUTFIT_BEHAVIOUR } from "features/feature-flags";

export default function HasSubscriptionContent({
  data,
  isCancelling,
  onClick,
}: Props) {
  const { currencyIsoCode, price, renewDate } = data;

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
    <Feature name={NEW_OUTFIT_BEHAVIOUR}>
      {(enabled: boolean) => (
        <div>
          <p>You are currently subscribed to Fallen London. </p>
          <div
            style={{
              // color: '#fff',
              display: "flex",
              justifyContent: "space-around",
              margin: "1rem 0",
            }}
          >
            <div>
              <div
                style={{
                  borderBottom: "solid 1px",
                  marginBottom: ".5rem",
                  paddingBottom: ".5rem",
                }}
              >
                Monthly payment amount:
              </div>
              <div style={{ fontSize: "125%" }}>
                {formattedPrice}
                {/* formatCurrency(currencyIsoCode, price.toFixed(2)) */}
              </div>
            </div>

            <div>
              <div
                style={{
                  borderBottom: "solid 1px",
                  marginBottom: ".5rem",
                  paddingBottom: ".5rem",
                }}
              >
                Next renewal date:
              </div>
              <div style={{ fontSize: "125%" }}>
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
            subscription, you will no longer have a second action candle,
            expanded opportunity deck,{" "}
            {enabled ? "two additional outfits," : ""} or access to the House of
            Chimes. You will no longer receive a new Exceptional Story every
            month. You will still be able to spend Memories of a Tale in Mr
            Chimes' Lost &amp; Found.
          </p>
          <button
            className="button button--primary button--no-margin"
            onClick={onClick}
            type="button"
          >
            {isCancelling ? "cancelling..." : "Cancel subscription"}
          </button>
        </div>
      )}
    </Feature>
  );
}

interface Props {
  data: ISubscriptionData;
  isCancelling: boolean;
  onClick: () => void;
}

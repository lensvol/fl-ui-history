import React from "react";

import MediaSmUp from "components/Responsive/MediaSmUp";
import MediaXsDown from "components/Responsive/MediaXsDown";
import Subscription from "../Subscription";
import ExceptionalStoryTrailerSmUp from "./ExceptionalStoryTrailerSmUp";
import ExceptionalStoryTrailerXsDown from "./ExceptionalStoryTrailerXsDown";
import { Props } from "./props";

export default function Header({
  onClick,
  data,
  concealStoryTrailerOnSmallDevices,
}: Props) {
  return (
    <div key="content fate-header">
      <h1 className="media__heading heading heading--2">
        Become an Exceptional Friend of the Bazaar
      </h1>
      <p>
        Exceptional friends receive a substantial story every month, double the
        actions (up to 40 at once), more cards to draw in their opportunity deck{" "}
        (10 instead of 6) and access to the House of Chimes.
      </p>

      {data.premiumSubPurchaseCard && (
        <>
          <MediaSmUp>
            <ExceptionalStoryTrailerSmUp data={data} />
          </MediaSmUp>
          <MediaXsDown>
            {!concealStoryTrailerOnSmallDevices && (
              <ExceptionalStoryTrailerXsDown data={data} />
            )}
          </MediaXsDown>
        </>
      )}

      <div className="fate-header__subscription-container">
        <Subscription onClick={onClick} />
      </div>
    </div>
  );
}

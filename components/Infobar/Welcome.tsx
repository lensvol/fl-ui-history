import React, { Fragment } from "react";

import ItsYou from "components/Infobar/ItsYou";
import TravelButton from "components/TravelButton";

import { useAppSelector } from "features/app/store";

import getNeedsProminentTravelButton from "selectors/map/getNeedsProminentTravelButton";

type Props = {
  currentAreaName: string;
  name: string;
};

export default function Welcome({ currentAreaName, name }: Props) {
  const needsProminentTravelButton = useAppSelector((state) =>
    getNeedsProminentTravelButton(state)
  );

  return (
    <Fragment>
      <p className="heading heading--3">
        <ItsYou name={name} />
        <br />
        Welcome to
      </p>
      <p className="heading heading--2 welcome__current-area">
        {currentAreaName},
      </p>
      <p className="heading heading--3">delicious friend!</p>
      {!needsProminentTravelButton && (
        <TravelButton className="travel-button--infobar" />
      )}
    </Fragment>
  );
}

Welcome.displayName = "Welcome";

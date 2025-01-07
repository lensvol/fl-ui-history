import React from "react";

import ItsYou from "components/Infobar/ItsYou";
import TravelButton from "components/TravelButton";

import { useAppSelector } from "features/app/store";

import getNeedsProminentTravelButton from "selectors/map/getNeedsProminentTravelButton";

export default function WelcomeAndTravel() {
  const currentArea = useAppSelector((state) => state.map.currentArea);
  const profileName = useAppSelector((state) => state.myself.character.name);
  const needsProminentTravelButton = useAppSelector((state) =>
    getNeedsProminentTravelButton(state)
  );

  if (!(profileName && currentArea)) {
    return null;
  }

  return (
    <div className="storylets__welcome-and-travel">
      <div className="heading heading--2">
        <ItsYou name={profileName} />{" "}
        {`Welcome to ${currentArea.name}, delicious friend!`}
      </div>
      {!needsProminentTravelButton && <TravelButton />}
    </div>
  );
}

WelcomeAndTravel.displayName = "WelcomeAndTravel";

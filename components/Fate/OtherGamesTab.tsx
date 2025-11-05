import React from "react";

import OtherGame, { GameIdentifier } from "components/Fate/OtherGame";

type Props = {
  active: boolean;
};

export default function OtherGamesTab({ active }: Props) {
  return (
    <div role="tabpanel" hidden={!active}>
      <h2 className="heading heading--2">Other Games</h2>

      <p
        style={{
          marginBottom: "1rem",
        }}
      >
        Discover more games from Failbetter Games, set within the world of
        Fallen London and beyond.
      </p>

      <div className="fate-other-games-outer">
        <div className="fate-other-games-container">
          <OtherGame gameId={GameIdentifier.Mandrake} />
          <OtherGame gameId={GameIdentifier.SunlessSkies} />
          <OtherGame gameId={GameIdentifier.SunlessSea} />
          <OtherGame gameId={GameIdentifier.MaskOfTheRose} />
        </div>
      </div>
    </div>
  );
}

OtherGamesTab.displayName = "OtherGamesTab";

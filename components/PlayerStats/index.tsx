import { NEW_OUTFIT_BEHAVIOUR } from "features/feature-flags";
import React from "react";
import { connect } from "react-redux";

import Loading from "components/Loading";
import ActionCounter from "components/ActionCounter";
import { IAppState } from "types/app";
import { Feature } from "flagged";
import PlayerEchoes from "./PlayerEchoes";
import PlayerFate from "./PlayerFate";
import PlayerScrip from "./PlayerScrip";

const mapStateToProps = (state: IAppState) => ({
  actions: state.actions,
});

type Props = ReturnType<typeof mapStateToProps>;

export function PlayerStats({ actions }: Props) {
  if (!actions) {
    return <Loading spinner />;
  }

  return (
    <ul className="items items--list">
      <li className="item">
        <ActionCounter />
      </li>
      <PlayerFate />
      <PlayerEchoes />
      <Feature name={NEW_OUTFIT_BEHAVIOUR}>
        <PlayerScrip />
      </Feature>
    </ul>
  );
}

PlayerStats.displayName = "PlayerStats";

export default connect(mapStateToProps)(PlayerStats);

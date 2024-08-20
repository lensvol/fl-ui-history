import React from "react";
import { connect } from "react-redux";

import Loading from "components/Loading";
import ActionCounter from "components/ActionCounter";
import { IAppState } from "types/app";
import PlayerEchoes from "./PlayerEchoes";
import PlayerFate from "./PlayerFate";
import SidebarCurrencies from "./SidebarCurrencies";

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
      <SidebarCurrencies />
    </ul>
  );
}

PlayerStats.displayName = "PlayerStats";

export default connect(mapStateToProps)(PlayerStats);

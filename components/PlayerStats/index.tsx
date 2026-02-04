import React from "react";

import ActionCounter from "components/ActionCounter";
import Loading from "components/Loading";
import PlayerEchoes from "components/PlayerStats/PlayerEchoes";
import PlayerFate from "components/PlayerStats/PlayerFate";
import SidebarCurrencies from "components/PlayerStats/SidebarCurrencies";

import { useAppSelector } from "features/app/store";

export default function PlayerStats() {
  const actions = useAppSelector((state) => state.actions);

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

import React from "react";

import { useDispatch } from "react-redux";

import Config from "configuration";

import { fetchActions } from "actions/actions";

import PlayerStats from "components/PlayerStats";
import SidebarOutfitSelector from "components/SidebarOutfitSelector/SidebarOutfitSelector";
import SidebarQualities from "components/SidebarQualities";
import ActionCandles from "components/ActionCandles";

import { useAppSelector } from "features/app/store";

import { UIRestriction } from "types/myself";

export default function Sidebar() {
  const dispatch = useDispatch();

  const showPossessionsUI = useAppSelector(
    (state) =>
      !state.myself.uiRestrictions?.find(
        (restriction) => restriction === UIRestriction.Possessions
      )
  );

  return (
    <div className="col-secondary sidebar">
      {(Config.environment === "local" || Config.environment === "staging") && (
        <button
          className="button--link"
          style={{
            position: "absolute",
            top: "-1rem",
            zIndex: 10,
          }}
          onClick={() => dispatch(fetchActions())}
          type="button"
        >
          <i className="fa fa-refresh" />
          <span className="u-visually-hidden">
            Forcibly refresh current actions
          </span>
        </button>
      )}
      <ActionCandles />
      <PlayerStats />
      {showPossessionsUI && <SidebarOutfitSelector />}
      <SidebarQualities />
    </div>
  );
}

Sidebar.displayName = "Sidebar";

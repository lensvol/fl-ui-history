import React from "react";

import { useDispatch } from "react-redux";

import Config from "configuration";

import { fetchActions, toggleChronograph } from "actions/actions";

import ActionCandles from "components/ActionCandles";
import PlayerStats from "components/PlayerStats";
import SidebarOutfitSelector from "components/SidebarOutfitSelector/SidebarOutfitSelector";
import SidebarQualities from "components/SidebarQualities";

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

  const isLive =
    Config.environment !== "local" && Config.environment !== "staging";
  const isAdmin = useAppSelector(
    (state) => state.user.privilegeLevel === "Admin"
  );

  return (
    <div className="col-secondary sidebar">
      {!isLive && (
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
      {(isAdmin || !isLive) && (
        <button
          className="button--link"
          style={{
            left: "1rem",
            position: "absolute",
            top: "-1rem",
            zIndex: 10,
          }}
          onClick={() => dispatch(toggleChronograph())}
          type="button"
        >
          <i className="fa fa-clock-o" />
          <span className="u-visually-hidden">Toggle choronograph</span>
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

import React from "react";

import { connect, useDispatch } from "react-redux";

import Config from "configuration";

import { fetchActions } from "actions/actions";

import PlayerStats from "components/PlayerStats";
import SidebarOutfitSelector from "components/SidebarOutfitSelector";
import SidebarQualities from "components/SidebarQualities";
import ActionCandles from "components/ActionCandles";
import { IAppState } from "types/app";
import { UIRestriction } from "types/myself";

const Sidebar = ({ showPossessionsUI }: Props) => {
  const dispatch = useDispatch();
  return (
    <div className="col-secondary sidebar">
      {(Config.environment === "local" || Config.environment === "staging") && (
        <button
          className="button--link"
          style={{ position: "absolute", top: "-1rem", zIndex: 10 }}
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
};

Sidebar.displayName = "Sidebar";

const mapStateToProps = ({ myself: { uiRestrictions } }: IAppState) => ({
  showPossessionsUI: !uiRestrictions?.find(
    (restriction) => restriction === UIRestriction.Possessions
  ),
});

type Props = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(Sidebar);

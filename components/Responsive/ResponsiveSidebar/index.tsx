import React, { useCallback } from "react";

import { useDispatch } from "react-redux";

import { useHistory } from "react-router-dom";

import classnames from "classnames";

import { enterFullScreen, exitFullScreen } from "actions/screen";
import { closeSidebar } from "actions/sidebar";
import { logoutUser } from "actions/user";

import PlayerStats from "components/PlayerStats";
import NavItem from "components/Responsive/ResponsiveSidebar/NavItem";
import ResponsiveSidebarOverlay from "components/Responsive/ResponsiveSidebar/ResponsiveSidebarOverlay";
import SidebarOutfitSelector from "components/SidebarOutfitSelector/SidebarOutfitSelector";
import SidebarQualities from "components/SidebarQualities";

import Config from "configuration";

import { useAppSelector } from "features/app/store";

import { UIRestriction } from "types/myself";

export default function ResponsiveSidebar() {
  const history = useHistory();

  const isOpen = useAppSelector((state) => state.sidebar.isOpen);
  const name = useAppSelector((state) => state.myself.character.name);
  const screen = useAppSelector((state) => state.screen);
  const uiRestrictions = useAppSelector((state) => state.myself.uiRestrictions);

  const showFateUI =
    uiRestrictions === undefined ||
    !uiRestrictions.find((restriction) => restriction === UIRestriction.Fate);

  const dispatch = useDispatch();

  const onCloseSidebar = useCallback(() => {
    dispatch(closeSidebar());
  }, [dispatch]);

  const onLogoutUser = useCallback(() => {
    dispatch(logoutUser());
  }, [dispatch]);

  const selectTab = useCallback(
    (location: string) => {
      // Close the sidebar
      dispatch(closeSidebar());

      // Take us to the new location
      history.push(location);
    },
    [dispatch, history]
  );

  const makeHandler = useCallback(
    (location: string) => () => selectTab(location),
    [selectTab]
  );

  const toggleFullScreen = useCallback(() => {
    dispatch(closeSidebar());

    if (screen.full) {
      return dispatch(exitFullScreen());
    }

    return dispatch(enterFullScreen());
  }, [dispatch, screen]);

  return (
    <div className="sidemenu-container">
      <ResponsiveSidebarOverlay isOpen={isOpen} onClose={onCloseSidebar} />

      <div
        className={classnames(
          "sidemenu sidemenu--left",
          isOpen && "sidemenu--open"
        )}
      >
        <PlayerStats />

        <SidebarOutfitSelector />

        <SidebarQualities />

        <nav className="sidemenu__nav">
          <ul className="items">
            <NavItem
              fl
              icon="myself"
              onClick={makeHandler(`/profile/${encodeURIComponent(name)}`)}
            >
              Your profile
            </NavItem>

            <NavItem icon="user" onClick={makeHandler("account")}>
              Account
            </NavItem>

            {showFateUI && (
              <NavItem fl icon="deck" onClick={makeHandler("fate")}>
                Fate
              </NavItem>
            )}

            <NavItem icon="star" onClick={makeHandler("plans")}>
              Plans
            </NavItem>

            <NavItem icon="newspaper-o" onClick={makeHandler("updates")}>
              Updates
            </NavItem>

            <NavItem icon="question-circle" onClick={makeHandler("help")}>
              Help
            </NavItem>

            <NavItem
              icon={screen.full ? "compress" : "expand"}
              onClick={toggleFullScreen}
            >
              {screen.full ? "Exit fullscreen" : "Go fullscreen"}
            </NavItem>

            <NavItem icon="list" onClick={makeHandler("credits")}>
              Credits
            </NavItem>

            <NavItem icon="sign-out" onClick={onLogoutUser}>
              Log out
            </NavItem>
          </ul>
        </nav>

        <div className="sidemenu__version-number">Version {Config.version}</div>
      </div>
    </div>
  );
}

ResponsiveSidebar.displayName = "ResponsiveSidebar";

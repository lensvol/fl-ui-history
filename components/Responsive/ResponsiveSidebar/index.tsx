import ResponsiveSidebarOverlay from "components/Responsive/ResponsiveSidebar/ResponsiveSidebarOverlay";
import React, { useCallback } from "react";
import { connect, useDispatch } from "react-redux";
import classnames from "classnames";
import { withRouter, RouteComponentProps } from "react-router-dom";

import { enterFullScreen, exitFullScreen } from "actions/screen";
import { closeSidebar } from "actions/sidebar";
import { logoutUser } from "actions/user";

import PlayerStats from "components/PlayerStats";
import Qualities from "components/SidebarQualities";
import SidebarOutfitSelector from "components/SidebarOutfitSelector";
import Config from "configuration";
import { IAppState } from "types/app";

import NavItem from "./NavItem";
import AdventLinkItem from "./AdventLinkItem";
import { UIRestriction } from "types/myself";

function ResponsiveSidebar(props: Props) {
  const { history, isOpen, name, screen, showFateUI } = props;

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
  }, [dispatch, screen.full]);

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
        <Qualities />
        <nav className="sidemenu__nav">
          <ul className="items">
            <AdventLinkItem />
            <NavItem fl icon="myself" onClick={makeHandler(`/profile/${name}`)}>
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
            <NavItem icon="question-circle" onClick={makeHandler("help")}>
              Help
            </NavItem>
            <NavItem
              icon={screen.full ? "compress" : "expand"}
              onClick={toggleFullScreen}
            >
              {screen.full ? "Exit fullscreen" : "Go fullscreen"}
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

const mapStateToProps = ({
  screen,
  sidebar,
  myself: {
    character: { name },
    uiRestrictions,
  },
}: IAppState) => ({
  ...sidebar,
  screen,
  name,
  showFateUI: !uiRestrictions?.find(
    (restriction) => restriction === UIRestriction.Fate
  ),
});

type Props = RouteComponentProps & ReturnType<typeof mapStateToProps>;

export default withRouter(connect(mapStateToProps)(ResponsiveSidebar));

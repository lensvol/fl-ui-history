import React, { useCallback, useMemo } from "react";
import { connect, useDispatch } from "react-redux";
import { withRouter, Link, RouteComponentProps } from "react-router-dom";
import { enterFullScreen, exitFullScreen } from "actions/screen";
import { IAppState } from "types/app";

import * as UserActionCreators from "actions/user";
import MediaLgUp from "../Responsive/MediaLgUp";

import AuthenticatedHeader from "./AuthenticatedHeader";
import UnauthenticatedHeader from "./UnauthenticatedHeader";
import AdventLink from "./AdventLink";

function Header(props: Props) {
  const { loggedIn, screen } = props;

  const dispatch = useDispatch();

  const handleLogout = useCallback(() => {
    dispatch(UserActionCreators.logoutUser());
  }, [dispatch]);

  const toggleFullScreen = useCallback(() => {
    if (screen.full) {
      return dispatch(exitFullScreen());
    }
    return dispatch(enterFullScreen());
  }, [dispatch, screen.full]);

  const navContent = useMemo(() => {
    if (loggedIn) {
      return (
        <AuthenticatedHeader
          onLogout={handleLogout}
          onToggleFullScreen={toggleFullScreen}
        />
      );
    }
    return <UnauthenticatedHeader />;
  }, [handleLogout, loggedIn, toggleFullScreen]);

  return (
    <MediaLgUp>
      <div className="top-stripe" role="banner">
        <AdventLink />
        <div className="top-stripe__inner-container">
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
            }}
          >
            <Link to="/">
              <div className="top-stripe__site-title">
                <span className="u-visually-hidden">Fallen London</span>
              </div>
            </Link>
          </div>
          <nav className="top-stripe__user">{navContent}</nav>
        </div>
      </div>
    </MediaLgUp>
  );
}

const mapStateToProps = (state: IAppState) => ({
  loggedIn: state.user.loggedIn,
  screen: state.screen,
});

type Props = RouteComponentProps & ReturnType<typeof mapStateToProps>;

export default withRouter(connect(mapStateToProps)(Header));

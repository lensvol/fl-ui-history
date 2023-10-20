import { FEATURE_IS_IT_ADVENT } from "features/feature-flags";
import React, { useCallback, useMemo } from "react";
import { connect, useDispatch } from "react-redux";
import { withRouter, Link, RouteComponentProps } from "react-router-dom";
import { Feature } from "flagged";
import { enterFullScreen, exitFullScreen } from "actions/screen";
import { IAppState } from "types/app";

import * as UserActionCreators from "actions/user";
import MediaLgUp from "../Responsive/MediaLgUp";

import AuthenticatedHeader from "./AuthenticatedHeader";
import UnauthenticatedHeader from "./UnauthenticatedHeader";

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
        <Feature name={FEATURE_IS_IT_ADVENT}>
          <div
            style={{
              alignItems: "center",
              display: "flex",
              marginLeft: "1rem",
            }}
          >
            <img
              src="https://images.fallenlondon.com/icons/mistersackssmall.png"
              height="18"
              alt="Mr Sacks"
              style={{
                marginRight: ".5rem",
              }}
            />
            <a href="//advent.fallenlondon.com"> It's Advent! </a>
          </div>
        </Feature>
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
  user: state.user.user,
});

type Props = RouteComponentProps & ReturnType<typeof mapStateToProps>;

export default withRouter(connect(mapStateToProps)(Header));

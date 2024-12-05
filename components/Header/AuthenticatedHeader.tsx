import React, { Fragment, useMemo } from "react";

import { Link, RouteComponentProps, withRouter } from "react-router-dom";

import classnames from "classnames";

import { useAppSelector } from "features/app/store";

enum CurrentLocation {
  Account,
  Help,
  Privacy,
  Terms,
  Credits,
  SomewhereElse,
}

function AuthenticatedHeader(props: Props) {
  const {
    onLogout,
    onToggleFullScreen,
    location: { pathname },
  } = props;

  const screen = useAppSelector((state) => state.screen);
  const user = useAppSelector((state) => state.user);

  const currentLocation = useMemo(() => {
    if (pathname.startsWith("/account")) {
      return CurrentLocation.Account;
    }

    if (pathname.startsWith("/help")) {
      return CurrentLocation.Help;
    }

    if (pathname.startsWith("/privacy")) {
      return CurrentLocation.Privacy;
    }

    if (pathname.startsWith("/terms")) {
      return CurrentLocation.Terms;
    }

    if (pathname.startsWith("/credits")) {
      return CurrentLocation.Credits;
    }

    return CurrentLocation.SomewhereElse;
  }, [pathname]);

  return (
    <Fragment>
      <button
        className="header__fullscreen-toggle"
        onClick={onToggleFullScreen}
        type="button"
      >
        <i
          className={classnames(
            "fa",
            screen.full ? "fa-compress" : "fa-expand"
          )}
        />
        <span className="u-visually-hidden">Toggle fullscreen mode</span>
      </button>
      <span className="top-stripe__user-name">
        {user.user ? `${user.user.name}:` : null}
      </span>{" "}
      <ul className="top-stripe__user-nav">
        {currentLocation !== CurrentLocation.SomewhereElse && (
          <li className="list-item--separated">
            <Link to="/">Back to game</Link>
          </li>
        )}

        {currentLocation !== CurrentLocation.Help && (
          <li className="list-item--separated">
            <Link to="/help">Help</Link>
          </li>
        )}

        {currentLocation !== CurrentLocation.Account && (
          <li className="list-item--separated">
            <Link to="/account">Account</Link>
          </li>
        )}

        {currentLocation !== CurrentLocation.Credits && (
          <li className="list-item--separated">
            <Link to="/credits">Credits</Link>
          </li>
        )}

        <li className="list-item--separated">
          <button
            onClick={onLogout}
            type="button"
            className="link header__logout-button"
          >
            Log out
          </button>
        </li>
      </ul>
    </Fragment>
  );
}

AuthenticatedHeader.displayName = "AuthenticatedHeader";

type Props = RouteComponentProps & {
  onLogout: () => void;
  onToggleFullScreen: () => void;
};

export default withRouter(AuthenticatedHeader);

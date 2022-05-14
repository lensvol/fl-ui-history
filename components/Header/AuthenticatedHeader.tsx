import React, {
  Fragment,
  useMemo,
} from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import {
  Link,
  RouteComponentProps,
  withRouter,
} from 'react-router-dom';
import { IAppState } from 'types/app';

// import AccountOrGameLink from './AccountOrGameLink';

export enum CurrentLocation {
  Account,
  Help,
  Privacy,
  Terms,
  SomewhereElse,
}

export function AuthenticatedHeader(props: Props) {
  const {
    onLogout,
    onToggleFullScreen,
    screen,
    user,
    location: { pathname },
  } = props;

  const currentLocation = useMemo(() => {
    if (pathname.startsWith('/account')) {
      return CurrentLocation.Account;
    }
    if (pathname.startsWith(('/help'))) {
      return CurrentLocation.Help;
    }
    if (pathname.startsWith('/privacy')) {
      return CurrentLocation.Privacy;
    }
    if (pathname.startsWith('/terms')) {
      return CurrentLocation.Terms;
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
        <i className={classnames('fa', screen.full ? 'fa-compress' : 'fa-expand')} />
        <span className="u-visually-hidden">Toggle fullscreen mode</span>
      </button>
      <span className="top-stripe__user-name">
        {user.user ? `${user.user.name}:` : null}
      </span>
      {' '}
      <ul className="top-stripe__user-nav">
        {currentLocation !== CurrentLocation.SomewhereElse && (
          <li className="list-item--separated">
            <Link to="/">
              Back to game
            </Link>
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

AuthenticatedHeader.displayName = 'AuthenticatedHeader';

const mapStateToProps = ({ screen, user }: IAppState) => ({ screen, user });

type Props = RouteComponentProps & ReturnType<typeof mapStateToProps> & {
  onLogout: () => void,
  onToggleFullScreen: () => void,
};

export default withRouter(connect(mapStateToProps)(AuthenticatedHeader));
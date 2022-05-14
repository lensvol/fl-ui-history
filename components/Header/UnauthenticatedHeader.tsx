import React, { Fragment } from 'react';
import { withRouter, Link } from 'react-router-dom';

export function UnauthenticatedHeader() {
  return (
    <Fragment>
      <ul className="user__nav list--horizontal">
        <li className="list-item--separated"><Link to="/help">Help</Link></li>
        <li className="list-item--separated"><Link to="/login">Log in</Link></li>
      </ul>
    </Fragment>
  );
}

UnauthenticatedHeader.displayName = 'UnauthenticatedHeader';

export default withRouter(UnauthenticatedHeader);
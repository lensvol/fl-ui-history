import { FEATURE_CREDITS } from "features/feature-flags";
import { useFeature } from "flagged";
import React, { Fragment } from "react";
import { withRouter, Link } from "react-router-dom";

export function UnauthenticatedHeader() {
  const hasCredits = useFeature(FEATURE_CREDITS);
  return (
    <Fragment>
      <ul className="user__nav list--horizontal">
        <li className="list-item--separated">
          <Link to="/help">Help</Link>
        </li>
        {!!hasCredits && (
          <li className="list-item--separated">
            <Link to="/credits">Credits</Link>
          </li>
        )}
        <li className="list-item--separated">
          <Link to="/login">Log in</Link>
        </li>
      </ul>
    </Fragment>
  );
}

UnauthenticatedHeader.displayName = "UnauthenticatedHeader";

export default withRouter(UnauthenticatedHeader);

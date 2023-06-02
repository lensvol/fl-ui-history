import React from "react";
import { connect } from "react-redux";
import { Route, Redirect, withRouter } from "react-router-dom";

import destructureJwt from "utils/destructureJwt";

export const RequireCharacter = ({
  component: Component,
  uiRestriction,
  uiRestrictions,
}) => {
  // TODO: this doesn't need calling on every route change
  const { userId, characterId } = destructureJwt();
  const shouldShowUI =
    !uiRestriction ||
    !uiRestrictions?.find((restriction) => restriction === uiRestriction);

  return (
    <Route
      render={(props) => {
        // If we're logged out entirely, then take us to the login page
        if (!userId) {
          return <Redirect to="/login" />;
        }

        // If we're logged in but don't have a character, take us to the character creation page
        if (!characterId) {
          return <Redirect to="/create-character" />;
        }

        // If we're logged in with a character, but the declared quality filter is in effect, redirect to Story tab
        if (!shouldShowUI) {
          return <Redirect to={{ pathname: "/" }} />;
        }

        // If we are logged in as a user who has a character, then take us to
        // the requested component
        return <Component {...props} />;
      }}
    />
  );
};

RequireCharacter.displayName = "RequireCharacter";

const mapStateToProps = ({
  user: { loggedIn },
  myself: { uiRestrictions },
}) => ({
  loggedIn,
  uiRestrictions,
});

export default withRouter(connect(mapStateToProps)(RequireCharacter));

import React from "react";
import { connect } from "react-redux";
import { Route, Redirect, withRouter } from "react-router-dom";

import destructureJwt from "utils/destructureJwt";

export const RequireCharacter = ({ component: Component }) => {
  // TODO: this doesn't need calling on every route change
  const { userId, characterId } = destructureJwt();

  return (
    <Route
      render={(props) => {
        // If we are logged in as a user who has a character, then take us to
        // the requested component
        if (userId && characterId) {
          return <Component {...props} />;
        }
        // If we're logged in but don't have a character, take us to the character creation page
        if (userId) {
          return <Redirect to="/create-character" />;
        }
        // If we're logged out entirely, then take us to the login page
        return <Redirect to="/login" />;
      }}
    />
  );
};

RequireCharacter.displayName = "RequireCharacter";

const mapStateToProps = ({ user: { loggedIn } }) => ({ loggedIn });

export default withRouter(connect(mapStateToProps)(RequireCharacter));

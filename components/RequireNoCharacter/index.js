import React from "react";
import { Route, Redirect, withRouter } from "react-router-dom";

import destructureJwt from "utils/destructureJwt";

export const RequireNoCharacter = ({ path, component: Component }) => {
  const { characterId, userId } = destructureJwt();
  return (
    <Route
      render={(props) => {
        // If we have a user ID and a character ID, then we aren't allowed to be here
        if (userId && characterId) {
          return <Redirect to="/" />;
        }
        // Don't redirect if we're already on create-character
        if (userId && path !== "/create-character") {
          return <Redirect to="/create-character" />;
        }
        return <Component {...props} />;
      }}
    />
  );
};

RequireNoCharacter.displayName = "RequireNoCharacter";

export default withRouter(RequireNoCharacter);

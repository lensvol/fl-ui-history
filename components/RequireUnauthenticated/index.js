import React from "react";
import { connect } from "react-redux";
import { Route, Redirect, withRouter } from "react-router-dom";

import destructureJwt from "utils/destructureJwt";

export function RequireUnauthenticated({ component: Component, ...rest }) {
  const { userId } = destructureJwt();
  return (
    <Route
      {...rest}
      render={(props) => {
        if (userId) {
          return <Redirect to={{ pathname: "/" }} />;
        }
        return <Component {...props} />;
      }}
    />
  );
}

RequireUnauthenticated.displayName = "RequireUnauthenticated";

const mapStateToProps = ({ user: { loggedIn } }) => ({ loggedIn });

export default withRouter(connect(mapStateToProps)(RequireUnauthenticated));

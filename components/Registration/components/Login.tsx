import React from "react";

import EmailPasswordLoginForm from "components/Registration/components/EmailPasswordLoginForm";
import FacebookLoginContainer from "components/Registration/components/FacebookLoginContainer";
import GoogleLoginContainer from "components/Registration/components/GoogleLoginContainer";

export default function Login() {
  return (
    <div role="tabpanel" className="tab-pane active" id="log-in">
      <h2 className="heading heading--2 heading--hr">Log in</h2>
      <EmailPasswordLoginForm />
      <hr />
      <p className="u-text-center">or</p>
      <p className="fb-root">
        <FacebookLoginContainer label="Sign in with Facebook" />
      </p>
      <p className="u-text-center">or</p>
      <GoogleLoginContainer />
      <p></p>
    </div>
  );
}

Login.displayName = "Login";

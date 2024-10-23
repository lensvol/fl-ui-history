import React from "react";

import FacebookLoginContainer from "components/Registration/components/FacebookLoginContainer";
import GoogleLoginContainer from "components/Registration/components/GoogleLoginContainer";
import SignUpWithEmail from "components/Registration/components/SignUpWithEmail";

export default function Signup() {
  return (
    <div role="tabpanel" className="tab-pane active" id="sign-up">
      <h2 className="heading heading--2 heading--hr">Create a free account</h2>
      <div>
        <SignUpWithEmail />
        <p className="u-text-center">or</p>
        <p className="fb-root">
          <FacebookLoginContainer />
        </p>
        <p className="u-text-center">or</p>
        <GoogleLoginContainer label="Sign up with Google" />
      </div>
    </div>
  );
}

Signup.displayName = "Signup";

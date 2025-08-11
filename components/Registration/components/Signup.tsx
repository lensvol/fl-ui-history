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
        <FacebookLoginContainer label="Sign up with Facebook" />
        <p className="u-text-center">or</p>
        <GoogleLoginContainer isSignUp />
      </div>
    </div>
  );
}

Signup.displayName = "Signup";

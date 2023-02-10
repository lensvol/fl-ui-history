import React from "react";

import FacebookLoginContainer from "./FacebookLoginContainer";
import GoogleLoginContainer from "./GoogleLoginContainer";
import SignUpWithEmail from "./SignUpWithEmail";

export default function Signup() {
  return (
    <div role="tabpanel" className="tab-pane active" id="sign-up">
      <h2 className="heading heading--2 heading--hr">Create a free account</h2>
      <div>
        <SignUpWithEmail />
        <Or />
        <p className="fb-root">
          <FacebookLoginContainer />
        </p>
        <Or />
        <GoogleLoginContainer label="Sign up with Google" />
      </div>
    </div>
  );
}

const Or = () => <p className="u-text-center">or</p>;

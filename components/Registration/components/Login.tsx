import React from "react";

import FacebookLoginContainer from "./FacebookLoginContainer";
import GoogleLoginContainer from "./GoogleLoginContainer";
import TwitterLoginContainer from "./TwitterLoginContainer";
import EmailPasswordLoginForm from "./EmailPasswordLoginForm";

export default function Login() {
  return (
    <>
      <div role="tabpanel" className="tab-pane active" id="log-in">
        <h2 className="heading heading--2 heading--hr">Log in</h2>

        <EmailPasswordLoginForm />

        <hr />

        <p className="u-text-center">or</p>
        <p className="fb-root">
          <FacebookLoginContainer />
        </p>
        <p className="u-text-center">or</p>
        <TwitterLoginContainer label="Log in with Twitter" />
        <p className="u-text-center">or</p>
        <GoogleLoginContainer label="Log in with Google" />
      </div>
    </>
  );
}

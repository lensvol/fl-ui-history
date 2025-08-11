import React, { useCallback } from "react";

import { useDispatch } from "react-redux";

import { RouteComponentProps, withRouter } from "react-router-dom";

import { googleLogin } from "actions/user";

import GoogleLoginButton from "components/Registration/components/GoogleLoginContainer/GoogleLoginButton";
import redirectAfterLogin from "components/Registration/components/redirectAfterLogin";

function GoogleLoginContainer({ history, isSignUp }: Props) {
  const dispatch = useDispatch();

  const handleSuccess = useCallback(
    async (googleAccessToken) => {
      // NOTE: this is a Google-provided access token, not our JWT
      const data: any = await dispatch(googleLogin(googleAccessToken));

      // Send the user where they need to go next
      redirectAfterLogin(history, data);
    },
    [dispatch, history]
  );

  return (
    <GoogleLoginButton
      className="button--google-login"
      handleSuccess={handleSuccess}
      isSignUp={isSignUp}
    />
  );
}

type OwnProps = {
  isSignUp?: boolean;
};

type Props = OwnProps & RouteComponentProps;

export default withRouter(GoogleLoginContainer);

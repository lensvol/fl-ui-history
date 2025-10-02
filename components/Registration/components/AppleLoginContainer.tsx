import React, { useCallback } from "react";

import { AppleAuthResponse } from "react-apple-signin-auth";

import { useDispatch } from "react-redux";

import { useHistory } from "react-router-dom";

import appleLogin from "actions/user/appleLogin";

import AppleLoginButton, {
  AppleSignInState,
} from "components/Registration/components/AppleLoginButton";
import redirectAfterLogin from "components/Registration/components/redirectAfterLogin";

type Props = {
  label: string;
  redirectURI: string;
  state: AppleSignInState;
};

export default function AppleLoginContainer({
  label,
  redirectURI,
  state,
}: Props) {
  const dispatch = useDispatch();
  const history = useHistory();

  const handleSuccess = useCallback(
    async (appleAuthResponse: AppleAuthResponse) => {
      // NOTE: this is a Apple-provided access token, not our JWT
      const data: any = await dispatch(appleLogin(appleAuthResponse));

      // Send the user where they need to go next
      redirectAfterLogin(history, data);
    },
    [dispatch, history]
  );

  return (
    <div className="apple-login">
      <AppleLoginButton
        className="button--apple-signin"
        handleSuccess={handleSuccess}
        label={label}
        redirectURI={redirectURI}
        showLogo
        state={state}
      />
    </div>
  );
}

AppleLoginContainer.displayName = "AppleLoginContainer";

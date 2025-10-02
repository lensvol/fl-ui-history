import React, { useCallback, useMemo } from "react";

import {
  appleAuthHelpers,
  AppleAuthOptions,
  AppleAuthResponse,
  SignInProps,
} from "react-apple-signin-auth";

import Config from "configuration";

import { getTokenAndStorage } from "features/startup";

export type AppleSignInState = {
  action: string;
  userId?: number;
  accessCode?: string;
};

type Props = {
  className: string;
  handleSuccess?: (appleAccessToken: AppleAuthResponse) => Promise<void>;
  label: string;
  redirectURI: string;
  showLogo?: boolean;
  state: AppleSignInState;
};

export default function AppleLoginButton({
  className,
  handleSuccess,
  label,
  redirectURI,
  showLogo,
  state,
}: Props) {
  const { token: nonce = "test nonce" } = getTokenAndStorage(window);

  const stateOption = useMemo(() => {
    const action = `"action":"${state.action}"`;
    const accessCode =
      '"accessCode":' +
      (state.accessCode === undefined ? "null" : `"${state.accessCode}"`);
    const userId =
      '"userId":' + (state.userId === undefined ? 0 : state.userId);

    return `{${action},${accessCode},${userId}}`;
  }, [state]);

  const handleError = useCallback((error: string) => {
    console.error(error);
  }, []);

  const authOptions: AppleAuthOptions = {
    clientId: Config.appleClientId,
    nonce,
    redirectURI: Config.appleRedirectUri + redirectURI,
    scope: "email",
    state: stateOption,
    usePopup: true,
  };

  const signInProps: SignInProps = {
    authOptions: authOptions,
    onSuccess: handleSuccess,
    onError: handleError,
  };

  const handleClick = useCallback(
    async (e: any) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }

      await appleAuthHelpers.signIn(signInProps);
    },
    [signInProps]
  );

  return (
    <button
      aria-label={label}
      className={className}
      onClick={handleClick}
      type="button"
    >
      {showLogo && (
        <>
          <i className="fa fa-fw fa-apple" />{" "}
        </>
      )}
      <span className="header--apple-link">{label}</span>
    </button>
  );
}

AppleLoginButton.displayName = "AppleLoginButton";

import React, { useCallback, useMemo, useState } from "react";

import { useDispatch } from "react-redux";

import classnames from "classnames";

import { unlinkSocialAccount } from "actions/settings";
import fetchAuthMethods from "actions/settings/fetchAuthMethods";
import { linkGoogle } from "actions/settings/linkSocialAccount";

import Loading from "components/Loading";
import GoogleLoginButton from "components/Registration/components/GoogleLoginContainer/GoogleLoginButton";

import { useAppSelector } from "features/app/store";

import { Success } from "services/BaseMonadicService";

export default function GoogleAuthComponent({
  inverse,
  onLinkFailure,
  onUnlinkFailure,
  onLinkSuccess,
}: Props) {
  const dispatch = useDispatch();
  const authMethods = useAppSelector((state) => state.settings.authMethods);

  const hasGoogleAuth = useMemo(
    () => !!authMethods?.find((m) => m.type === "Google"),
    [authMethods]
  );

  const [isLinking, setIsLinking] = useState(false);
  const [isUnlinking, setIsUnlinking] = useState(false);

  const onClickToUnlink = useCallback(async () => {
    setIsUnlinking(true);

    const result = await unlinkSocialAccount("google")(dispatch);

    await fetchAuthMethods()(dispatch);

    if (!(result instanceof Success)) {
      onUnlinkFailure?.(result.message);
    }

    setIsUnlinking(false);
  }, [dispatch, onUnlinkFailure]);

  const onLoginSuccess = useCallback(
    async (authResponse) => {
      if (authResponse) {
        setIsLinking(true);

        const request = {
          token: authResponse.credential,
        };

        const result = await linkGoogle(request)(dispatch);

        if (result instanceof Success) {
          onLinkSuccess?.();

          await fetchAuthMethods()(dispatch);
        } else {
          onLinkFailure?.(result.message);
        }

        setIsLinking(false);
      }
    },
    [dispatch, onLinkFailure, onLinkSuccess]
  );

  if (isLinking || isUnlinking) {
    return (
      <div
        style={{
          display: "flex",
          marginLeft: "3px",
        }}
      >
        <Loading spinner small />
      </div>
    );
  }

  if (hasGoogleAuth) {
    return (
      <>
        <i className="fa fa-fw fa-google" />{" "}
        <button
          onClick={onClickToUnlink}
          type="button"
          className={classnames(
            "button--link",
            inverse && "button--link-inverse"
          )}
        >
          Unlink Google
        </button>
      </>
    );
  }

  return (
    <>
      {!inverse && (
        <>
          <i className="fa fa-fw fa-google" />{" "}
          <span className="header--google-link">
            Link Google to this account:
          </span>
        </>
      )}
      <GoogleLoginButton
        className={inverse ? "" : "button--google-link"}
        handleSuccess={onLoginSuccess}
      />
    </>
  );
}

type Props = {
  inverse?: boolean;
  onLinkFailure?: (message: string) => void;
  onLinkSuccess?: () => void;
  onUnlinkFailure?: (message: string) => void;
};

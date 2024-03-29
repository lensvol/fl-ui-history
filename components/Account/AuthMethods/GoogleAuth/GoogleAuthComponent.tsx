import React, { useCallback, useMemo, useState } from "react";
import classnames from "classnames";
import { connect, useDispatch } from "react-redux";
import { IAppState } from "types/app";
import Loading from "components/Loading";
import { Success } from "services/BaseMonadicService";
import { useGoogleLogin } from "@react-oauth/google";
import { unlinkSocialAccount } from "actions/settings";
import fetchAuthMethods from "actions/settings/fetchAuthMethods";
import { linkGoogle } from "actions/settings/linkSocialAccount";

export function GoogleAuthComponent({
  authMethods,
  inverse,
  onLinkFailure,
  onUnlinkFailure,
  onLinkSuccess,
}: Props) {
  const dispatch = useDispatch();

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
        const request = { token: authResponse.access_token };
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

  const onLoginFailure = useCallback((..._args) => {
    // TODO: handle Google auth failure gracefully. This is called when the
    //   user does not authenticate with Google (not if linking fails)
  }, []);

  const doGoogleAuth = useGoogleLogin({
    onSuccess: onLoginSuccess,
    onError: onLoginFailure,
  });

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
          <span>Unlink Google</span>
        </button>
      </>
    );
  }

  return (
    <>
      <i className="fa fa-fw fa-google" />{" "}
      <button
        className={classnames(
          "button--link",
          inverse && "button--link-inverse"
        )}
        onClick={() => doGoogleAuth()}
        type="button"
      >
        Link Google to this account
      </button>
    </>
  );
}

type OwnProps = {
  inverse?: boolean;
  onLinkFailure?: (message: string) => void;
  onUnlinkFailure?: (message: string) => void;
  onLinkSuccess?: () => void;
};

const mapStateToProps = (state: IAppState) => ({
  authMethods: state.settings.authMethods,
});

type Props = OwnProps & ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(GoogleAuthComponent);

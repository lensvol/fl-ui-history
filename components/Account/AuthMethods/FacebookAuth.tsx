import React, { useCallback } from "react";
import FacebookLogin, {
  ReactFacebookLoginInfo,
  ReactFacebookFailureResponse,
} from "react-facebook-login";
import { useDispatch } from "react-redux";

import classnames from "classnames";

import { linkFacebook, unlinkSocialAccount } from "actions/settings";

import Config from "configuration";

import { useAppSelector } from "features/app/store";

export default function FacebookAuth(props: Props) {
  const { buttonClassName, onLinkSuccess } = props;

  const facebookAuth = useAppSelector(
    (state) => state.settings.data.facebookAuth
  );

  const dispatch = useDispatch();

  const onLoginFailure = useCallback((_res: ReactFacebookFailureResponse) => {
    /* do nothing for now */
  }, []);

  const onLoginSuccess = useCallback(
    (res: ReactFacebookLoginInfo) => {
      dispatch(linkFacebook(res));

      onLinkSuccess?.();
    },
    [dispatch, onLinkSuccess]
  );

  const onClickToUnlink = useCallback(() => {
    dispatch(unlinkSocialAccount("facebook"));
  }, [dispatch]);

  if (facebookAuth) {
    return (
      <li>
        <i className="fa fa-facebook-square" />{" "}
        <em>
          <button
            type="button"
            className={classnames("button--link", buttonClassName)}
            onClick={onClickToUnlink}
          >
            Unlink Facebook from this account
          </button>
        </em>
      </li>
    );
  }

  return (
    <>
      <i className="fa fa-fw fa-facebook-square" />{" "}
      <FacebookLogin
        appId={`${Config.facebookAppId}`}
        cssClass={classnames("button--link", buttonClassName)}
        textButton="Link Facebook to this account"
        autoLoad={false}
        fields="email"
        callback={onLoginSuccess}
        onFailure={onLoginFailure}
      />
    </>
  );
}

type Props = {
  buttonClassName?: string;
  onLinkSuccess?: () => void;
};

FacebookAuth.displayName = "FacebookAuth";

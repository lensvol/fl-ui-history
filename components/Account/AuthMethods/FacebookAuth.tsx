import React, { useCallback } from "react";
import classnames from "classnames";
import { connect, useDispatch } from "react-redux";
import FacebookLogin, {
  ReactFacebookLoginInfo,
  ReactFacebookFailureResponse,
} from "react-facebook-login";

import { linkFacebook, unlinkSocialAccount } from "actions/settings";
import { IAppState } from "types/app";
import Config from "configuration";

export function FacebookAuth(props: Props) {
  const {
    buttonClassName,
    data: { facebookAuth },
    onLinkSuccess,
  } = props;

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
        fields="name,email,picture"
        callback={onLoginSuccess}
        onFailure={onLoginFailure}
      />
    </>
  );
}

type OwnProps = {
  buttonClassName?: string;
  onLinkSuccess?: () => void;
};

const mapStateToProps = (state: IAppState) => ({
  data: state.settings.data,
});

type Props = OwnProps & ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(FacebookAuth);

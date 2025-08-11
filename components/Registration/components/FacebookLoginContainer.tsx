import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { withRouter, RouteComponentProps } from "react-router-dom";

import FacebookLogin, {
  ReactFacebookFailureResponse,
} from "react-facebook-login";

import { facebookLogin } from "actions/user";

import redirectAfterLogin from "components/Registration/components/redirectAfterLogin";

import Config from "configuration";

function FacebookLoginContainer({ history, label }: Props) {
  const dispatch = useDispatch();
  const { facebookAppId } = Config;

  const handleCallback = useCallback(
    async (res: any) => {
      const data: any = await dispatch(facebookLogin(res));

      redirectAfterLogin(history, data);
    },
    [dispatch, history]
  );

  const handleFailure = useCallback(
    async (res: ReactFacebookFailureResponse) => {
      console.error(res.status);
    },
    []
  );

  return (
    <div className="fb-root">
      <FacebookLogin
        appId={`${facebookAppId}`}
        autoLoad={false}
        callback={handleCallback}
        cssClass="button--menlo-park-panopticon"
        disableMobileRedirect
        fields="email"
        icon={<i className="fa fa-facebook" />}
        onFailure={handleFailure}
        textButton={label}
        version="3.1"
      />
    </div>
  );
}

type Props = RouteComponentProps & {
  label?: string;
};

export default withRouter(FacebookLoginContainer);

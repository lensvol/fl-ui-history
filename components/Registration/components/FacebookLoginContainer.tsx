import React, { useCallback } from "react";
import { connect, useDispatch } from "react-redux";
import { withRouter, RouteComponentProps } from "react-router-dom";

import FacebookLogin from "react-facebook-login";

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

  return (
    <FacebookLogin
      appId={`${facebookAppId}`}
      autoLoad={false}
      callback={handleCallback}
      cssClass="button button--menlo-park-panopticon"
      disableMobileRedirect
      fields="name,email,picture"
      icon={<i className="fa fa-facebook-official fa-2x" />}
      textButton={label}
      version="3.1"
    />
  );
}

type Props = RouteComponentProps & {
  label?: string;
};

export default withRouter(connect()(FacebookLoginContainer));

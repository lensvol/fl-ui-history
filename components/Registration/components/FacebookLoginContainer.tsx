import React, {
  useCallback,
} from 'react';
import {
  connect,
  useDispatch,
} from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import FacebookLogin from 'react-facebook-login';

import Config from 'configuration';

import { facebookLogin } from 'actions/user';

import redirectAfterLogin from './redirectAfterLogin';

function FacebookLoginContainer({ history }: Props) {
  const dispatch = useDispatch();
  const { facebookAppId } = Config;

  const handleCallback = useCallback(async (res: any) => {
    const data: any = await dispatch(facebookLogin(res));
    redirectAfterLogin(history, data);
  }, [dispatch, history]);

  return (
    <FacebookLogin
      appId={`${facebookAppId}`}
      autoLoad={false}
      cssClass="button button--menlo-park-panopticon"
      fields="name,email,picture"
      icon={<i className="fa fa-facebook-official fa-2x" />}
      callback={handleCallback}
      version="3.1"
      disableMobileRedirect
    />
  );
}

type Props = RouteComponentProps;

export default withRouter(connect()(FacebookLoginContainer));
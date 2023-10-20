import React, { useCallback } from "react";
import { connect, useDispatch } from "react-redux";
import { withRouter, RouteComponentProps } from "react-router-dom";
import TwitterLogin from "@failbetter/react-twitter-auth";

import { twitterLogin, twitterLoginFailure } from "actions/user";

import Config from "configuration";

import redirectAfterLogin from "./redirectAfterLogin";

export function TwitterLoginContainer({ history, label }: Props) {
  const dispatch = useDispatch();

  const handleFailure = useCallback(
    (error) => {
      if (error.toString() !== "Error: Popup has been closed by user") {
        dispatch(twitterLoginFailure());
      }
    },
    [dispatch]
  );

  const handleSuccess = useCallback(
    async (res) => {
      // Parse the response as JSON (the component is using native fetch, so doesn't do this for us)
      const data = await res.json();

      // Update the Redux store
      dispatch(twitterLogin(data));

      redirectAfterLogin(history, data);
    },
    [dispatch, history]
  );

  const { apiUrl } = Config;

  return (
    <TwitterLogin
      loginUrl={`${apiUrl}twitter/login`}
      className="button button--big-blue-bird-from-san-francisco"
      text={label}
      onFailure={handleFailure}
      onSuccess={handleSuccess}
      requestTokenUrl={`${apiUrl}twitter/requesttoken`}
      credentials="include"
      showIcon
    />
  );
}
/*
export class TwitterLoginContainer extends Component {
  handleFailure = (error) => {
    const { dispatch } = this.props;
    if (error.toString() !== 'Error: Popup has been closed by user') {
      dispatch(twitterLoginFailure());
    }
  }

  handleSuccess = async (res) => {
    const { dispatch, history } = this.props;
    // Parse the response as JSON (the component is using native fetch, so doesn't do this for us)
    const body = await res.json();
    // Update the redux store
    const data = await dispatch(twitterLogin(body));

    // TODO: this is an error state; we are notifying Airbrake, but we should
    // let the user know that something's gone wrong
    if (!data) {
      return;
    }

    redirectAfterLogin(history, data);
  }

  render = () => {
    const { label } = this.props;
    const { apiUrl } = Config;
    return (
      <TwitterLogin
        loginUrl={`${apiUrl}twitter/login`}
        className="button button--big-blue-bird-from-san-francisco"
        text={label}
        onFailure={this.handleFailure}
        onSuccess={this.handleSuccess}
        requestTokenUrl={`${apiUrl}twitter/requesttoken`}
        credentials="include"
        showIcon
      />
    );
  }
}

TwitterLoginContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
};
*/

type OwnProps = { label: string };
type Props = OwnProps & RouteComponentProps;

export default withRouter(connect()(TwitterLoginContainer));

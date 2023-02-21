import React, { useCallback } from "react";
import { connect, useDispatch } from "react-redux";
import { withRouter, RouteComponentProps } from "react-router-dom";
import TwitterLogin from "@failbetter/react-twitter-auth";

import { twitterLogin, twitterLoginFailure } from "actions/user";

import Config from "configuration";

import redirectAfterLogin from "./redirectAfterLogin";
import { useAppSelector } from "features/app/store";

export function TwitterLoginContainer({ history, label }: Props) {
  const dispatch = useDispatch();

  const handleFailure = useCallback(
    (error) => {
      if (error.toString() !== "Error: Popup has been closed by user") {
        dispatch(twitterLoginFailure(error));
      }
    },
    [dispatch]
  );

  const handleSuccess = useCallback(
    async (res) => {
      // Parse the response as JSON (the component is using native fetch, so doesn't do this for us)
      const data = await res.json();

      if (data.isSuccess) {
        // Update the Redux store
        dispatch(twitterLogin(data));

        redirectAfterLogin(history, data);
      } else {
        dispatch(twitterLoginFailure(data));
      }
    },
    [dispatch, history]
  );

  const { apiUrl } = Config;

  // reusing a previously-abandoned property to indicate login error
  const isTwitterNagScreenOpen = useAppSelector(
    (state) => state.user.isTwitterNagScreenOpen
  );

  return (
    <>
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
      <p>
        {isTwitterNagScreenOpen
          ? "We were not able to log you in with Twitter."
          : null}
      </p>
    </>
  );
}

type OwnProps = { label: string };
type Props = OwnProps & RouteComponentProps;

export default withRouter(connect()(TwitterLoginContainer));

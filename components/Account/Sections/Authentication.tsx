import React, { useEffect } from "react";
import AuthMethods from "components/Account/AuthMethods";
import Loading from "components/Loading";

import { connect, useDispatch } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";

import { fetch as fetchSettings } from "actions/settings";

import { IAppState } from "types/app";

type Props = RouteComponentProps & ReturnType<typeof mapStateToProps>;

const mapStateToProps = ({ settings: { data, isFetching } }: IAppState) => ({
  data,
  isFetching,
});

function AuthenticationSection({ data, isFetching }: Props) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!data) {
      dispatch(fetchSettings());
    }
  }, [data, dispatch]);

  if (isFetching) {
    return (
      <div style={{ padding: 24 }}>
        <Loading spinner />
      </div>
    );
  }

  return (
    <>
      <AuthMethods />
    </>
  );
}

export default withRouter(connect(mapStateToProps)(AuthenticationSection));

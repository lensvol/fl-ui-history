import React, { useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";

import MessagingRubric from "../MessagingRubric";
import MessagePreferencesForm from "../MessagePreferencesForm";

import { fetch as fetchSettings } from "actions/settings";

import Loading from "components/Loading";

import { IAppState } from "types/app";

type Props = RouteComponentProps & ReturnType<typeof mapStateToProps>;

const mapStateToProps = ({ settings: { data, isFetching } }: IAppState) => ({
  data,
  isFetching,
});

function Messaging({ data, isFetching }: Props) {
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
      <MessagingRubric />
      <MessagePreferencesForm />
    </>
  );
}

export default withRouter(connect(mapStateToProps)(Messaging));

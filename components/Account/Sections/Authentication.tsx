import React, { useEffect } from "react";

import { useDispatch } from "react-redux";

import { fetch as fetchSettings } from "actions/settings";

import AuthMethods from "components/Account/AuthMethods";
import Loading from "components/Loading";

import { useAppSelector } from "features/app/store";

export default function AuthenticationSection() {
  const data = useAppSelector((state) => state.settings.data);
  const isFetching = useAppSelector((state) => state.settings.isFetching);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!data) {
      dispatch(fetchSettings());
    }
  }, [data, dispatch]);

  if (isFetching) {
    return (
      <div
        style={{
          padding: 24,
        }}
      >
        <Loading spinner />
      </div>
    );
  }

  return <AuthMethods />;
}

AuthenticationSection.displayName = "AuthenticationSection";

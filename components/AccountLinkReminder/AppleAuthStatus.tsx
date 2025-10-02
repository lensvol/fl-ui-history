import React, { useMemo } from "react";

import AppleAuth from "components/Account/AuthMethods/AppleAuth";

import { useAppSelector } from "features/app/store";

export default function AppleAuthStatus() {
  const authMethods = useAppSelector((state) => state.settings.authMethods);

  const method = useMemo(
    () => authMethods?.find((m) => m.type === "Apple"),
    [authMethods]
  );

  if (method) {
    return (
      <>
        <i className="fa fa-check" /> Linked to{" "}
        <strong>{method.displayName}</strong>.
      </>
    );
  }

  return <AppleAuth className="button--link-inverse" />;
}

AppleAuthStatus.displayName = "AppleAuthStatus";

import React, { useMemo } from "react";

import GoogleAuth from "components/Account/AuthMethods/GoogleAuth";

import { useAppSelector } from "features/app/store";

export default function GoogleAuthStatus() {
  const authMethods = useAppSelector((state) => state.settings.authMethods);

  const method = useMemo(
    () => authMethods?.find((m) => m.type === "Google"),
    [authMethods]
  );

  if (method) {
    return (
      <>
        <i className="fa fa-fw fa-check" /> Linked to{" "}
        <strong>{method.displayName}</strong>.
      </>
    );
  }

  return <GoogleAuth inverse />;
}

GoogleAuthStatus.displayName = "GoogleAuthStatus";

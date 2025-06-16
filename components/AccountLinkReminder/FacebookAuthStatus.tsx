import React, { useMemo } from "react";

import FacebookAuth from "components/Account/AuthMethods/FacebookAuth";

import { useAppSelector } from "features/app/store";

export default function FacebookAuthStatus() {
  const authMethods = useAppSelector((state) => state.settings.authMethods);

  const method = useMemo(
    () => authMethods?.find((m) => m.type === "Facebook"),
    [authMethods]
  );

  if (method) {
    return (
      <p>
        <i className="fa fa-check" /> Linked to{" "}
        <strong>{method.displayName}</strong>.
      </p>
    );
  }

  return <FacebookAuth buttonClassName="button--link button--link-inverse" />;
}

FacebookAuthStatus.displayName = "FacebookAuthStatus";

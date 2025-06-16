import React, { useMemo } from "react";

import EmailAuth from "components/Account/AuthMethods/EmailAuth";

import { useAppSelector } from "features/app/store";

export default function EmailAuthStatus() {
  const authMethods = useAppSelector((state) => state.settings.authMethods);

  const emailAuthMethod = useMemo(
    () => authMethods?.find((method) => method.type === "Email"),
    [authMethods]
  );

  if (emailAuthMethod) {
    return (
      <>
        <i className="fa fa-check" /> Linked to{" "}
        <strong>{emailAuthMethod.email}</strong>.
      </>
    );
  }

  return <EmailAuth buttonClassName="button--link-inverse" />;
}

EmailAuthStatus.displayName = "EmailAuthStatus";

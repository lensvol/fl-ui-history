import React, { useMemo } from "react";
import { connect } from "react-redux";
import { IAppState } from "types/app";
import GoogleAuth from "components/Account/AuthMethods/GoogleAuth";

export function GoogleAuthStatus({ authMethods }: Props) {
  const method = useMemo(
    () => authMethods?.find((m) => m.type === "Google"),
    [authMethods]
  );

  if (!method) {
    return <GoogleAuth inverse />;
  }

  return (
    <>
      <i className="fa fa-fw fa-check" />
      Linked to <strong>{method.displayName}</strong>.
    </>
  );
}

const mapStateToProps = ({ settings: { authMethods } }: IAppState) => ({
  authMethods,
});

type Props = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(GoogleAuthStatus);

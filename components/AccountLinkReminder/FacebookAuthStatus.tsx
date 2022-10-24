import React, { useMemo } from "react";
import { connect } from "react-redux";
import { IAppState } from "types/app";
import FacebookAuth from "components/Account/AuthMethods/FacebookAuth";

export function FacebookAuthStatus({ authMethods }: Props) {
  const method = useMemo(
    () => authMethods?.find((m) => m.type === "Facebook"),
    [authMethods]
  );
  if (method) {
    return (
      <>
        <p>
          <i className="fa fa-check" /> Linked to{" "}
          <strong>{method.displayName}</strong>.
        </p>
      </>
    );
  }
  return (
    <>
      <FacebookAuth buttonClassName="button--link button--link-inverse" />
    </>
  );
}

const mapStateToProps = ({ settings: { authMethods } }: IAppState) => ({
  authMethods,
});

type Props = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(FacebookAuthStatus);

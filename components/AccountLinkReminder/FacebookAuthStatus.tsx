import React, { useMemo } from "react";
import { connect } from "react-redux";
import { IAppState } from "types/app";
import FacebookAuth from "components/Account/AuthMethods/FacebookAuth";

export function FacebookAuthStatus({ authMethods, onLinkSuccess }: Props) {
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
      <FacebookAuth
        buttonClassName="button--link button--link-inverse"
        onLinkSuccess={onLinkSuccess}
      />
    </>
  );
}

type OwnProps = {
  onLinkSuccess: () => void;
};

const mapStateToProps = ({ settings: { authMethods } }: IAppState) => ({
  authMethods,
});

type Props = OwnProps & ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(FacebookAuthStatus);

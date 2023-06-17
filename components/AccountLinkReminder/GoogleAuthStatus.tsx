import React, { useMemo } from "react";
import { connect } from "react-redux";
import { IAppState } from "types/app";
import GoogleAuth from "components/Account/AuthMethods/GoogleAuth";

export function GoogleAuthStatus({ authMethods, onLinkSuccess }: Props) {
  const method = useMemo(
    () => authMethods?.find((m) => m.type === "Google"),
    [authMethods]
  );

  if (!method) {
    return <GoogleAuth inverse onLinkSuccess={onLinkSuccess} />;
  }

  return (
    <>
      <i className="fa fa-fw fa-check" />
      Linked to <strong>{method.displayName}</strong>.
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

export default connect(mapStateToProps)(GoogleAuthStatus);

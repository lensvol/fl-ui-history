import React, { useMemo } from "react";
import { connect } from "react-redux";
import { IAppState } from "types/app";

export function TwitterAuthStatus({ authMethods }: Props) {
  const twitterAuthMethod = useMemo(
    () => authMethods?.find((method) => method.type === "Twitter"),
    [authMethods]
  );
  if (twitterAuthMethod) {
    return (
      <>
        <li key="Twitter">
          <h3 className="heading heading--3">Twitter</h3>
          <p>
            Due to recent changes at Twitter, we urge you to strongly consider
            adding an email login option.
          </p>
          <i className="fa fa-check" /> Linked to Twitter.
        </li>
      </>
    );
  }
  return <></>;
}

const mapStateToProps = ({ settings: { authMethods } }: IAppState) => ({
  authMethods,
});

type Props = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(TwitterAuthStatus);

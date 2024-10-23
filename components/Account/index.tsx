import React, { useCallback, useEffect, useState } from "react";

import { connect } from "react-redux";

import { useHistory, useLocation, withRouter } from "react-router-dom";

import AccountComponent from "components/Account/AccountComponent";
import ForgottenPasswordResetModal from "components/Account/ForgottenPasswordResetModal";

import { IAppState } from "types/app";

function AccountContainer({ loggedIn }: Props) {
  const history = useHistory();
  const location = useLocation();

  const [didLoad, setDidLoad] = useState(false);
  const [hash, setHash] = useState<any | undefined>(undefined);
  const [token, setToken] = useState<string | undefined>(undefined);
  const [
    isForgottenPasswordResetModalOpen,
    setIsForgottenPasswordResetModalOpen,
  ] = useState(false);

  const getQueryVariable = useCallback((variable: string) => {
    const query = window.location.search.substring(1);
    const vars = query.split("&");

    for (let i = 0; i < vars.length; i += 1) {
      const pair = vars[i].split("=");

      if (decodeURIComponent(pair[0]) === variable) {
        return decodeURIComponent(pair[1]);
      }
    }

    return undefined;
  }, []);

  useEffect(() => {
    if (didLoad) {
      // only run once
      return;
    }

    setHash(location.hash);

    const token = getQueryVariable("token");

    if (token) {
      setToken(token);
      setIsForgottenPasswordResetModalOpen(true);
    } else if (!loggedIn) {
      history.push("/login");
    }

    setDidLoad(true);
  }, [didLoad, getQueryVariable, history, location, loggedIn]);

  const handleDismissForgottenPasswordResetModal = useCallback(() => {
    setIsForgottenPasswordResetModalOpen(false);
  }, []);

  return (
    <>
      {loggedIn && <AccountComponent hash={hash} />}

      {/* Don't mount the forgotten password modal if we don't have a token */}
      {token && (
        <ForgottenPasswordResetModal
          isOpen={isForgottenPasswordResetModalOpen}
          onRequestClose={handleDismissForgottenPasswordResetModal}
          token={token}
        />
      )}
    </>
  );
}

AccountContainer.displayName = "AccountContainer";

const mapStateToProps = (state: IAppState) => ({
  loggedIn: state.user.loggedIn,
});

type Props = ReturnType<typeof mapStateToProps>;

export default withRouter(connect(mapStateToProps)(AccountContainer));

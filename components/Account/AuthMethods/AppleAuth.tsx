import React, { useCallback, useMemo, useState } from "react";

import { AppleAuthResponse } from "react-apple-signin-auth";

import { useDispatch } from "react-redux";

import classnames from "classnames";

import { unlinkSocialAccount } from "actions/settings";
import fetchAuthMethods from "actions/settings/fetchAuthMethods";
import { linkApple } from "actions/settings/linkSocialAccount";

import Loading from "components/Loading";
import Modal from "components/Modal";
import AppleLoginButton from "components/Registration/components/AppleLoginButton";

import { useAppSelector } from "features/app/store";

import { Success } from "services/BaseMonadicService";

type Props = {
  className?: string;
};

export default function AppleAuth({ className }: Props) {
  const dispatch = useDispatch();

  const authMethods = useAppSelector((state) => state.settings.authMethods);
  const userId = useAppSelector((state) => state.user.user?.id) ?? 0;

  const [isLinking, setIsLinking] = useState(false);
  const [isUnlinking, setIsUnlinking] = useState(false);
  const [isResultModalOpen, setIsResultOpenModal] = useState(false);
  const [message, setMessage] = useState<string | undefined>(undefined);

  const handleFailure = useCallback((failureMessage: string) => {
    setMessage(failureMessage);
    setIsResultOpenModal(true);
  }, []);

  const hasAppleAuth = useMemo(() => {
    if (authMethods) {
      return authMethods.some((m) => m.type === "Apple");
    }

    return false;
  }, [authMethods]);

  const onClickToUnlink = useCallback(async () => {
    setIsUnlinking(true);

    const result = await unlinkSocialAccount("apple")(dispatch);

    await fetchAuthMethods()(dispatch);

    if (!(result instanceof Success)) {
      handleFailure(result.message);
    }

    setIsUnlinking(false);
  }, [dispatch, handleFailure]);

  const handleSuccess = useCallback(
    async (appleAccessToken: AppleAuthResponse) => {
      if (appleAccessToken) {
        setIsLinking(true);

        const result = await linkApple(appleAccessToken)(dispatch);

        if (result instanceof Success) {
          await fetchAuthMethods()(dispatch);
        } else {
          handleFailure(result.message);
        }

        setIsLinking(false);
      }
    },
    [dispatch, handleFailure]
  );

  if (isLinking || isUnlinking) {
    return (
      <div
        style={{
          display: "flex",
          marginLeft: "3px",
        }}
      >
        <Loading spinner small />
      </div>
    );
  }

  if (hasAppleAuth) {
    return (
      <>
        <i className="fa fa-fw fa-apple" />{" "}
        <button
          className={classnames("button--link", className)}
          onClick={onClickToUnlink}
          type="button"
        >
          Unlink Apple
        </button>
        <Modal
          isOpen={isResultModalOpen}
          onAfterClose={() => setMessage(undefined)}
          onRequestClose={() => setIsResultOpenModal(false)}
        >
          {message}
        </Modal>
      </>
    );
  }

  return (
    <>
      <i className="fa fa-fw fa-apple" />{" "}
      <AppleLoginButton
        className={classnames("button--link", className)}
        handleSuccess={handleSuccess}
        label="Link Apple to this account"
        redirectURI="/account"
        state={{
          action: "link",
          userId,
        }}
      />
      <Modal
        isOpen={isResultModalOpen}
        onAfterClose={() => setMessage(undefined)}
        onRequestClose={() => setIsResultOpenModal(false)}
      >
        {message}
      </Modal>
    </>
  );
}

AppleAuth.displayName = "AppleAuth";

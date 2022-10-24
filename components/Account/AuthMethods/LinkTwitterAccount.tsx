/* eslint-disable camelcase */
import React, { useCallback, useState } from "react";
import axios from "axios";
import classnames from "classnames";

import Config from "configuration";
import { Success } from "services/BaseMonadicService";
import SettingsService from "services/SettingsService";
import Modal from "components/Modal";
import Loading from "components/Loading";

export function LinkTwitterAccount({ buttonClassName, onFailure }: Props) {
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [isLinking, setIsLinking] = useState(false);
  const [modalMessage, setModalMessage] = useState<string | undefined>(
    undefined
  );

  const onRequestCloseProgressModal = useCallback(() => {
    if (isLinking) {
      return;
    }
    setIsProgressModalOpen(false);
  }, [isLinking]);

  const openPopup = useCallback(() => {
    const width = 400;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    return window.open(
      "",
      "",
      [
        "toolbar=no",
        "location=no",
        "directories=no",
        "status=no",
        "menubar=no",
        "scrollbars=no",
        "resizable=no",
        "copyhistory=no",
        `width=${width}`,
        `height=${height}`,
        `top=${top}`,
        `left=${left}`,
      ].join(", ")
    );
  }, []);

  const linkOnOurServer = useCallback(
    async (oauthVerifier: string, oauthToken: string) => {
      const request = {
        oauth_token: oauthToken,
        oauth_verifier: oauthVerifier,
      };
      const result = await new SettingsService().linkTwitter(request);
      if (result instanceof Success) {
        setModalMessage("Twitter account linked!");
      } else {
        setModalMessage(result.message);
      }
      setIsLinking(false);
    },
    []
  );

  const startPollingPopup = useCallback(
    (popup: Window | null) => {
      const polling = setInterval(() => {
        if (!popup || popup.closed || popup.closed === undefined) {
          clearInterval(polling);
          onFailure("Popup has been closed by user");
          return;
        }

        const closeDialog = () => {
          clearInterval(polling);
          popup.close();
        };

        try {
          const {
            location: { hostname, search },
          } = popup;
          if (
            !hostname.includes("api.twitter.com") &&
            popup.location.hostname !== ""
          ) {
            if (search) {
              const query = new URLSearchParams(search);
              const oauthToken = query.get("oauth_token");
              const oauthVerifier = query.get("oauth_verifier");

              closeDialog();

              if (!(oauthToken && oauthVerifier)) {
                onFailure(
                  "Failed to find `oauth_token` and `oath_verifier` while polling."
                );
                return;
              }

              linkOnOurServer(oauthVerifier, oauthToken);
            } else {
              onFailure(
                new Error(
                  "OAuth redirect has occurred but no query or hash parameters were found. " +
                    "They were either not set during the redirect, or were removed—typically by a " +
                    "routing library—before Twitter react component could read it."
                )
              );
            }
          }
        } catch (error) {
          // Ignore DOMException: Blocked a frame with origin from accessing a cross-origin frame
          // A hack to get around same-origin security policy errors in IE.
        }
      }, 500);
    },
    [linkOnOurServer, onFailure]
  );

  const onClick = useCallback(async () => {
    setIsLinking(true);
    setIsProgressModalOpen(true);

    const popup = openPopup();

    if (!popup) {
      onFailure("LinkTwitterAccount.openPopup() returned null.");
      return;
    }

    const response = await axios.post(`${Config.apiUrl}/twitter/requesttoken`, {
      method: "POST",
    });

    if (response?.data?.oauth_token) {
      popup.location.href = `https://api.twitter.com/oauth/authenticate?oauth_token=${response.data.oauth_token}`;
      startPollingPopup(popup);
    }
  }, [onFailure, openPopup, startPollingPopup]);

  return (
    <>
      <button
        className={classnames("button--link", buttonClassName)}
        type="button"
        onClick={onClick}
      >
        Link Twitter to this account
      </button>
      <Modal
        isOpen={isProgressModalOpen}
        onRequestClose={onRequestCloseProgressModal}
        onAfterClose={() => setModalMessage(undefined)}
      >
        {isLinking && <Loading spinner />}
        {modalMessage && <span>{modalMessage}</span>}
      </Modal>
    </>
  );
}

type OwnProps = {
  buttonClassName?: string | undefined;
  onFailure: (message: Error | string) => void;
};

type Props = OwnProps;

export default LinkTwitterAccount;

import React, { useCallback, useState } from "react";

import { useDispatch } from "react-redux";

import classnames from "classnames";

import { fetch as fetchSettings } from "actions/settings";

import LinkEmailModal from "components/Account/AuthMethods/LinkEmailModal";
import UpdateEmailModal from "components/Account/AuthMethods/UpdateEmailModal";
import VerifyEmailModal from "components/Account/AuthMethods/VerifyEmailModal";

import { useAppSelector } from "features/app/store";

type Props = {
  buttonClassName?: string;
  onLinkSuccess?: () => void;
  showVerificationLink?: boolean;
};

export default function EmailAuth({
  buttonClassName,
  onLinkSuccess,
  showVerificationLink,
}: Props) {
  const data = useAppSelector((state) => state.settings.data);

  const { emailAddress, emailAuth, emailVerified } = data;

  const [isLinkEmailModalOpen, setIsLinkEmailModalOpen] = useState(false);
  const [isUpdateEmailModalOpen, setIsUpdateEmailModalOpen] = useState(false);
  const [isVerifyEmailModalOpen, setIsVerifyEmailModalOpen] = useState(false);

  const handleCloseLinkEmailModal = useCallback(
    () => setIsLinkEmailModalOpen(false),
    []
  );
  const handleCloseUpdateEmailModal = useCallback(
    () => setIsUpdateEmailModalOpen(false),
    []
  );
  const handleCloseVerifyEmailModal = useCallback(
    () => setIsVerifyEmailModalOpen(false),
    []
  );
  const onClickToLink = useCallback(() => setIsLinkEmailModalOpen(true), []);
  const onClickToUpdate = useCallback(
    () => setIsUpdateEmailModalOpen(true),
    []
  );
  const onClickToVerify = useCallback(
    () => setIsVerifyEmailModalOpen(true),
    []
  );

  const buttonLabel = emailAuth ? emailAddress : "Link your email account";
  const onClick = emailAuth ? onClickToUpdate : onClickToLink;

  const dispatch = useDispatch();

  const didLinkEmail = useCallback(() => {
    if (onLinkSuccess) {
      onLinkSuccess();
    }

    dispatch(fetchSettings());
  }, [dispatch, onLinkSuccess]);

  return (
    <>
      <i className="fa fa-fw fa-envelope" />{" "}
      <button
        type="button"
        className={classnames("button--link", buttonClassName)}
        onClick={onClick}
      >
        {buttonLabel}
      </button>{" "}
      {emailAuth &&
        showVerificationLink &&
        (emailVerified ? (
          "(verified)"
        ) : (
          <>
            (
            <button
              type="button"
              className={classnames("button--link", buttonClassName)}
              onClick={onClickToVerify}
            >
              send verification email
            </button>
            )
          </>
        ))}
      <LinkEmailModal
        isOpen={isLinkEmailModalOpen}
        onRequestClose={handleCloseLinkEmailModal}
        onLinkSuccess={didLinkEmail}
      />
      <UpdateEmailModal
        isOpen={isUpdateEmailModalOpen}
        onRequestClose={handleCloseUpdateEmailModal}
      />
      <VerifyEmailModal
        isOpen={isVerifyEmailModalOpen}
        onRequestClose={handleCloseVerifyEmailModal}
      />
    </>
  );
}

EmailAuth.displayName = "EmailAuth";

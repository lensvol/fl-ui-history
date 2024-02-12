import React, { useCallback, useState } from "react";
import classnames from "classnames";
import { connect, useDispatch } from "react-redux";
import { IAppState } from "types/app";
import LinkEmailModal from "./LinkEmailModal";
import UpdateEmailModal from "./UpdateEmailModal";
import VerifyEmailModal from "./VerifyEmailModal";

import { fetch as fetchSettings } from "actions/settings";

export function EmailAuth(props: Props) {
  const {
    buttonClassName,
    data: { emailAuth, emailAddress, emailVerified },
    onLinkSuccess,
    showVerificationLink,
  } = props;

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
    onLinkSuccess?.();

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

const mapStateToProps = (state: IAppState) => ({
  data: state.settings.data,
});

type OwnProps = {
  buttonClassName?: string;
  onLinkSuccess?: () => void;
  showVerificationLink?: boolean;
};

type Props = OwnProps & ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(EmailAuth);

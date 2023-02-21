import LinkEmailModal from "components/Account/AuthMethods/LinkEmailModal";
import { useAppSelector } from "features/app/store";
import React, { useMemo, useState, useCallback } from "react";
import UpdateEmailModal from "./AuthMethods/UpdateEmailModal";

export default function MessagingRubric() {
  const emailAddress = useAppSelector(
    (state) => state.settings.data.emailAddress
  );

  const content = useMemo(() => {
    if (!emailAddress) {
      return <NoLinkedEmailRubric />;
    }

    return <LinkedEmailRubric emailAddress={emailAddress} />;
  }, [emailAddress]);

  return (
    <>
      <h2 className="heading heading--2">Email notifications</h2>
      {content}
    </>
  );
}

function LinkedEmailRubric({ emailAddress }: { emailAddress: string }) {
  const [isUpdateEmailModalOpen, setIsUpdateEmailModalOpen] = useState(false);

  const handleClickToUpdate = useCallback(() => {
    setIsUpdateEmailModalOpen(true);
  }, []);

  const handleRequestClose = useCallback(() => {
    setIsUpdateEmailModalOpen(false);
  }, []);

  return (
    <>
      <div>
        <p>
          When interesting or important things happen, we can send notifications
          to the email address you've linked to this account:
        </p>
        <p>
          {emailAddress}{" "}
          <button
            className="button--link"
            type="button"
            onClick={handleClickToUpdate}
          >
            (Update)
          </button>
        </p>
      </div>

      <UpdateEmailModal
        isOpen={isUpdateEmailModalOpen}
        onRequestClose={handleRequestClose}
      />
    </>
  );
}

function NoLinkedEmailRubric() {
  const [isLinkEmailModalOpen, setIsLinkEmailModalOpen] = useState(false);

  const handleClickToLink = useCallback(() => {
    setIsLinkEmailModalOpen(true);
  }, []);

  const handleCloseLinkEmailModal = useCallback(() => {
    setIsLinkEmailModalOpen(false);
  }, []);

  return (
    <>
      <div>
        <p>
          We can send you email notifications when interesting or important
          things happen if you link your email address to this account.
        </p>
        <div className="buttons">
          <button
            type="button"
            className="button button--primary"
            onClick={handleClickToLink}
          >
            Link email
          </button>
        </div>
      </div>

      <LinkEmailModal
        isOpen={isLinkEmailModalOpen}
        onRequestClose={handleCloseLinkEmailModal}
      />
    </>
  );
}

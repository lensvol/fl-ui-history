import { FEATURE_ACCOUNT_LINK_REMINDER } from "features/feature-flags";
import React, { useCallback, useMemo, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { withFeature } from "flagged";

import { IAppState } from "types/app";
import { hideAccountLinkReminder } from "actions/accountLinkReminder";
import Modal from "components/Modal";
import { AccountLinkReminderStep } from "./constants";
import AccountLinkReminderLoading from "./AccountLinkReminderLoading";
import AccountLinkReminderReady from "./AccountLinkReminderReady";
import { STORAGE_KEY_ACCOUNT_LINK_REMINDER_NEVER_NAG } from "constants/accountLinkReminder";

export function AccountLinkReminder({
  isFetchingAuthMethods,
  isFetchingSettings,
  isOpen,
  twitterAuth,
}: Props) {
  const isFetching = useMemo(
    () => isFetchingAuthMethods || isFetchingSettings,
    [isFetchingAuthMethods, isFetchingSettings]
  );

  const dispatch = useDispatch();

  const [currentStep, setCurrentStep] = useState(AccountLinkReminderStep.Ready);

  const onAfterClose = useCallback(
    () => setCurrentStep(AccountLinkReminderStep.Ready),
    []
  );
  const onRequestClose = useCallback(() => {
    if (isFetching) {
      return;
    }
    dispatch(hideAccountLinkReminder());
  }, [dispatch, isFetching]);

  const content = useMemo(() => {
    if (isFetching) {
      return <AccountLinkReminderLoading />;
    }
    switch (currentStep) {
      default:
        return <AccountLinkReminderReady onRequestClose={onRequestClose} />;
    }
  }, [currentStep, isFetching, onRequestClose]);

  const userPrefersAuthNagSuppression = JSON.parse(
    localStorage.getItem(STORAGE_KEY_ACCOUNT_LINK_REMINDER_NEVER_NAG) ?? "false"
  );

  if (userPrefersAuthNagSuppression && !twitterAuth) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onAfterClose={onAfterClose}
      onRequestClose={onRequestClose}
      shouldCloseOnOverlayClick={false}
    >
      {content}
    </Modal>
  );
}

const mapStateToProps = ({
  accountLinkReminder: { isModalOpen: isOpen },
  settings: {
    isFetchingAuthMethods,
    isFetching: isFetchingSettings,
    data: { twitterAuth },
  },
}: IAppState) => ({
  isFetchingAuthMethods,
  isFetchingSettings,
  isOpen,
  twitterAuth,
});

type Props = ReturnType<typeof mapStateToProps>;

export default withFeature(FEATURE_ACCOUNT_LINK_REMINDER)(
  connect(mapStateToProps)(AccountLinkReminder)
);

import React, { useCallback, useMemo, useState } from "react";

import { useDispatch } from "react-redux";

import { hideAccountLinkReminder } from "actions/accountLinkReminder";

import AccountLinkReminderLoading from "components/AccountLinkReminder/AccountLinkReminderLoading";
import AccountLinkReminderReady from "components/AccountLinkReminder/AccountLinkReminderReady";
import { AccountLinkReminderStep } from "components/AccountLinkReminder/constants";
import Modal from "components/Modal";

import { STORAGE_KEY_ACCOUNT_LINK_REMINDER_NEVER_NAG } from "constants/accountLinkReminder";

import { useAppSelector } from "features/app/store";

export default function AccountLinkReminder() {
  const isFetchingAuthMethods = useAppSelector(
    (state) => state.settings.isFetchingAuthMethods
  );
  const isFetchingSettings = useAppSelector(
    (state) => state.settings.isFetching
  );
  const isOpen = useAppSelector(
    (state) => state.accountLinkReminder.isModalOpen
  );

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

  if (userPrefersAuthNagSuppression) {
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

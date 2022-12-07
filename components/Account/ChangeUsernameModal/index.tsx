import React, { useCallback, useState } from "react";
import Modal from "components/Modal";
import { changeUsernameSuccess } from "actions/settings/changeUsername";
import { useAppDispatch } from "features/app/store";
import { FormikHelpers as FormikActions } from "formik";
import { Success } from "services/BaseMonadicService";
import SettingsService from "services/SettingsService";
import CompleteMessage from "./CompleteMessage";
import ChangeUsernameForm from "./ChangeUsernameForm";

type Props = {
  isOpen: boolean;
  onRequestClose: () => void;
};

type FormValues = {
  username: string;
};

export default function ChangeUsernameModal({ isOpen, onRequestClose }: Props) {
  const dispatch = useAppDispatch();
  const [isComplete, setIsComplete] = useState(false);

  const handleAfterClose = useCallback(() => {
    setIsComplete(false);
  }, []);

  const handleSubmit = useCallback(
    async (
      { username }: FormValues,
      { setSubmitting, setErrors }: FormikActions<FormValues>
    ) => {
      setSubmitting(true);
      const response = await new SettingsService().changeUsername(username);
      setSubmitting(false);
      if (response instanceof Success) {
        dispatch(changeUsernameSuccess(username));
        setIsComplete(true);
        return;
      }

      setErrors({ username: response.message });
    },
    [dispatch]
  );

  return (
    <Modal
      isOpen={isOpen}
      onAfterClose={handleAfterClose}
      onRequestClose={onRequestClose}
    >
      {isComplete ? (
        <CompleteMessage onRequestClose={onRequestClose} />
      ) : (
        <ChangeUsernameForm onSubmit={handleSubmit} />
      )}
    </Modal>
  );
}

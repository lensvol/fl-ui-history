import React from "react";
import { FormikHelpers as FormikActions } from "formik";

import Modal from "components/Modal";

import CompleteMessage from "./CompleteMessage";
import ForgottenPasswordResetForm from "./ForgottenPasswordResetForm";

type Props = {
  isComplete: boolean;
  isOpen: boolean;
  isSuccess: boolean;
  message: string | undefined;
  onAfterClose: () => void;
  onClickWhenFailed: () => void;
  onClickWhenSuccessful: () => void;
  onRequestClose: () => void;
  onSubmit: (
    values: { password: string },
    actions: FormikActions<{ password: string }>
  ) => Promise<void>;
};

export default function ForgottenPasswordResetModalComponent(props: Props) {
  const {
    isComplete,
    isOpen,
    isSuccess,
    message,
    onAfterClose,
    onClickWhenFailed,
    onClickWhenSuccessful,
    onRequestClose,
    onSubmit,
  } = props;

  return (
    <Modal
      isOpen={isOpen}
      onAfterClose={onAfterClose}
      onRequestClose={onRequestClose}
    >
      {isComplete ? (
        <CompleteMessage
          isSuccess={isSuccess}
          message={message}
          onClickWhenFailed={onClickWhenFailed}
          onClickWhenSuccessful={onClickWhenSuccessful}
        />
      ) : (
        <ForgottenPasswordResetForm onSubmit={onSubmit} />
      )}
    </Modal>
  );
}

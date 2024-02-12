import React, { useCallback, useMemo, useState } from "react";
import { useDispatch } from "react-redux";

import { Field, Form, Formik, FormikHelpers } from "formik";

import requestVerifyEmail from "actions/settings/verifyEmailAddress";

import Loading from "components/Loading";
import Modal from "components/Modal";

import { useAppSelector } from "features/app/store";

import { Success } from "services/BaseMonadicService";
import { VersionMismatch } from "services/BaseService";

import wait from "utils/wait";

enum VerifyEmailModalStep {
  Ready,
  Success,
}

type OwnProps = {
  isOpen: boolean;
  onRequestClose: () => void;
};

export default function VerifyEmailModal({ isOpen, onRequestClose }: OwnProps) {
  const emailAddress = useAppSelector(
    (state) => state.settings.data.emailAddress
  );
  const socialActsAvailable = useAppSelector(
    (state) => state.settings.data.socialActsAvailable
  );

  const dispatch = useDispatch();

  const [currentStep, setCurrentStep] = useState(VerifyEmailModalStep.Ready);

  const [message, setMessage] = useState<string | undefined>(undefined);

  const handleAfterClose = useCallback(() => {
    setMessage(undefined);
    setCurrentStep(VerifyEmailModalStep.Ready);
  }, []);

  const handleSubmit = useCallback(
    async (
      values,
      {
        setSubmitting,
        setErrors,
      }: FormikHelpers<{
        emailAddress: string;
      }>
    ) => {
      setSubmitting(true);

      await wait(500);

      const result = await requestVerifyEmail()(dispatch);

      setSubmitting(false);

      // Return silently if the user needs to refresh the page anyway
      if (result instanceof VersionMismatch) {
        return;
      }

      if (result instanceof Success) {
        setCurrentStep(VerifyEmailModalStep.Success);
        setMessage(result.data.message);

        return;
      }

      setErrors({
        emailAddress: result.message,
      });

      setMessage(result.message);
    },
    [dispatch]
  );

  const contents = useMemo(() => {
    switch (currentStep) {
      case VerifyEmailModalStep.Success:
        return (
          <div>
            <h3 className="heading heading--2">Verification email sent!</h3>
            <p>{message}</p>
          </div>
        );

      default:
        return (
          <div>
            <h3 className="heading heading--2">Verify email address</h3>
            <Formik
              initialValues={{
                emailAddress: emailAddress ?? "",
              }}
              onSubmit={handleSubmit}
              render={({ isSubmitting }) => (
                <Form>
                  <p
                    style={{
                      paddingTop: 12,
                    }}
                  >
                    <div>
                      Please verify your email address ({emailAddress}).
                      {!socialActsAvailable && (
                        <>
                          {" "}
                          Once your email is verified, you can participate in
                          social acts and receive social email messages.
                        </>
                      )}
                    </div>
                    <Field
                      id="emailAddress"
                      className="form__control"
                      type="hidden"
                      name="emailAddress"
                      value={emailAddress}
                    />
                  </p>
                  {message ? (
                    <p dangerouslySetInnerHTML={{ __html: message }} />
                  ) : null}
                  <div className="dialog__actions" style={{ marginTop: 24 }}>
                    <button
                      className="button button--primary"
                      disabled={isSubmitting}
                      onClick={onRequestClose}
                      type="button"
                    >
                      Cancel
                    </button>
                    <button
                      className="button button--primary"
                      disabled={isSubmitting}
                      type="submit"
                    >
                      {isSubmitting ? (
                        <Loading spinner small />
                      ) : (
                        <span>Verify Email</span>
                      )}
                    </button>
                  </div>
                </Form>
              )}
            />
          </div>
        );
    }
  }, [
    currentStep,
    emailAddress,
    handleSubmit,
    message,
    onRequestClose,
    socialActsAvailable,
  ]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      onAfterClose={handleAfterClose}
    >
      {contents}
    </Modal>
  );
}

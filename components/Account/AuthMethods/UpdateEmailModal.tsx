import { updateEmailAddress } from "actions/settings";
import Loading from "components/Loading";
import Modal from "components/Modal";
import { useAppSelector } from "features/app/store";
import { Field, Form, Formik, FormikHelpers } from "formik";
import React, { useCallback, useMemo, useState } from "react";

import { useDispatch } from "react-redux";
import { Success } from "services/BaseMonadicService";
import { VersionMismatch } from "services/BaseService";
import wait from "utils/wait";

enum UpdateEmailModalStep {
  Ready,
  Success, // eslint-disable-line no-shadow
}

type OwnProps = {
  isOpen: boolean;
  onRequestClose: () => void;
};

export default function UpdateEmailModal(props: OwnProps) {
  const { isOpen, onRequestClose } = props;

  const emailAddress = useAppSelector(
    (state) => state.settings.data.emailAddress
  );

  const dispatch = useDispatch();

  const [currentStep, setCurrentStep] = useState(UpdateEmailModalStep.Ready);

  const [message, setMessage] = useState<string | undefined>(undefined);

  const handleAfterClose = useCallback(() => {
    setMessage(undefined);
    setCurrentStep(UpdateEmailModalStep.Ready);
  }, []);

  const handleSubmit = useCallback(
    async (
      values,
      { setSubmitting, setErrors }: FormikHelpers<{ emailAddress: string }>
    ) => {
      const { emailAddress: newEmailAddress } = values;
      setSubmitting(true);
      await wait(500);
      const result = await updateEmailAddress(newEmailAddress)(dispatch);
      setSubmitting(false);
      // Return silently if the user needs to refresh the page anyway
      if (result instanceof VersionMismatch) {
        return;
      }
      if (result instanceof Success) {
        setCurrentStep(UpdateEmailModalStep.Success);
        setMessage(`Your email address is now ${newEmailAddress}`);
        return;
      }

      setErrors({ emailAddress: result.message });
      setMessage(result.message);
    },
    [dispatch]
  );

  const contents = useMemo(() => {
    switch (currentStep) {
      case UpdateEmailModalStep.Success:
        return (
          <div>
            <h3 className="heading heading--2">Email address updated!</h3>
            <p>{message}</p>
          </div>
        );

      default:
        return (
          <div>
            <h3 className="heading heading--2">Update email address</h3>
            <Formik
              initialValues={{ emailAddress: emailAddress ?? "" }}
              onSubmit={handleSubmit}
              render={({ values, dirty, isSubmitting }) => (
                <Form>
                  <p style={{ paddingTop: 12 }}>
                    <label htmlFor="emailAddress">Email</label>
                    <Field
                      id="emailAddress"
                      className="form__control"
                      type="email"
                      name="emailAddress"
                      value={values.emailAddress}
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
                      disabled={isSubmitting || !dirty}
                      type="submit"
                    >
                      {isSubmitting ? (
                        <Loading spinner small />
                      ) : (
                        <span>Update Email</span>
                      )}
                    </button>
                  </div>
                </Form>
              )}
            />
          </div>
        );
    }
  }, [currentStep, emailAddress, handleSubmit, message, onRequestClose]);

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

// export default UpdateEmailModal;

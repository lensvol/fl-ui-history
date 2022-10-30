import { updateEmailAddress } from "actions/settings";
import React, { useCallback, useMemo, useState } from "react";
import { Field, Form, Formik } from "formik";

import { connect, useDispatch } from "react-redux";
import { Success } from "services/BaseMonadicService";
import { IAppState } from "types/app";
import Modal from "components/Modal";
import Loading from "components/Loading";
import wait from "utils/wait";

enum UpdateEmailModalStep {
  Ready,
  Success, // eslint-disable-line no-shadow
}

function UpdateEmailModal(props: Props) {
  const {
    isOpen,
    data: { emailAddress },
    onRequestClose,
  } = props;

  const dispatch = useDispatch();

  const [currentStep, setCurrentStep] = useState(UpdateEmailModalStep.Ready);

  const [message, setMessage] = useState<string | undefined>(undefined);

  const handleAfterClose = useCallback(() => {
    setMessage(undefined);
    setCurrentStep(UpdateEmailModalStep.Ready);
  }, []);

  const handleSubmit = useCallback(
    async (values, { setSubmitting }) => {
      const { emailAddress: newEmailAddress } = values;
      setSubmitting(true);
      await wait(500);
      const result = await dispatch(updateEmailAddress(newEmailAddress));
      setSubmitting(false);
      if (result instanceof Success) {
        setCurrentStep(UpdateEmailModalStep.Success);
        setMessage(`Your email address is now ${newEmailAddress}`);
      }
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

type OwnProps = {
  isOpen: boolean;
  onRequestClose: () => void;
};

const mapStateToProps = (state: IAppState) => ({
  isUpdatingEmail: state.settings.isUpdatingEmail,
  data: state.settings.data,
});

type Props = OwnProps & ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(UpdateEmailModal);

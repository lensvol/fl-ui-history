import React, { useCallback, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { Formik, Field, Form, FormikHelpers as FormikActions } from "formik";

import Loading from "components/Loading";
import { Either, Success } from "services/BaseMonadicService";
import { LinkEmailResponse } from "services/SettingsService";
import { IAppState } from "types/app";
import Modal from "components/Modal";
import { linkEmailToAccount } from "actions/settings";

type LinkEmailValues = { emailAddress: string; password: string };

enum LinkEmailModalStep {
  Ready,
  Working,
  LinkSuccess,
}

function LinkEmailModal({ isLinkingEmail, isOpen, onRequestClose }: Props) {
  const dispatch = useDispatch();

  const [currentStep, setCurrentStep] = useState(LinkEmailModalStep.Ready);
  const [message, setMessage] = useState<string | undefined>(undefined);

  const handleSubmit = useCallback(
    async (
      values: LinkEmailValues,
      actions: FormikActions<LinkEmailValues>
    ) => {
      const { emailAddress, password } = values;
      actions.setSubmitting(true);

      const result: Either<LinkEmailResponse> = await linkEmailToAccount({
        emailAddress,
        password,
      })(dispatch);

      actions.setSubmitting(false);

      if (result instanceof Success) {
        setCurrentStep(LinkEmailModalStep.LinkSuccess);
        setMessage(result.data.message);
      }
    },
    [dispatch]
  );

  switch (currentStep) {
    case LinkEmailModalStep.LinkSuccess:
      return <div>{message}</div>;

    default:
      return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
          <div>
            <h3 className="heading heading--2">Link Email To Account</h3>
            <Formik
              initialValues={{ emailAddress: "", password: "" }}
              onSubmit={handleSubmit}
              render={({ values, dirty }) => (
                <Form>
                  <p>
                    <label htmlFor="emailAddress">Email</label>
                    <Field
                      className="form__control"
                      name="emailAddress"
                      value={values.emailAddress}
                    />
                  </p>

                  <p>
                    <label htmlFor="password">Password</label>
                    <Field
                      className="form__control"
                      type="password"
                      name="password"
                      value={values.password}
                    />
                  </p>

                  <div className="dialog__actions" style={{ marginTop: 24 }}>
                    <button
                      className="button button--primary"
                      onClick={onRequestClose}
                      type="button"
                    >
                      Cancel
                    </button>
                    <button
                      className="button button--primary"
                      disabled={!dirty || isLinkingEmail}
                      type="submit"
                    >
                      {isLinkingEmail ? (
                        <Loading spinner small />
                      ) : (
                        <span>Link Email</span>
                      )}
                    </button>
                  </div>
                </Form>
              )}
            />
          </div>
        </Modal>
      );
  }
}

type OwnProps = {
  isOpen: boolean;
  onRequestClose: () => void;
};

const mapStateToProps = ({ settings }: IAppState) => ({
  isLinkingEmail: settings.isLinkingEmail,
});

type Props = OwnProps & ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(LinkEmailModal);

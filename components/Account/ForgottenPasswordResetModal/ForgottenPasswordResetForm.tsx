import React, { useCallback, useState } from "react";

import { Form, Formik, FormikHelpers as FormikActions } from "formik";

import Loading from "components/Loading";

import useIsMounted from "hooks/useIsMounted";
import PasswordField from "components/Registration/PasswordField";

type SubmitType = (
  values: { password: string },
  actions: FormikActions<{ password: string }>
) => Promise<void>;

type Props = {
  onSubmit: SubmitType;
};

export default function ForgottenPasswordResetForm({ onSubmit }: Props) {
  const [submitting, setSubmitting] = useState(false);

  const isMounted = useIsMounted();

  const handleSubmit = useCallback(
    async (values, actions) => {
      setSubmitting(true);

      await onSubmit(values, actions);

      if (isMounted.current) {
        setSubmitting(false);
      }
    },
    [isMounted, onSubmit]
  );

  return (
    <Formik
      initialValues={{
        password: "",
      }}
      onSubmit={handleSubmit}
      render={({ values }) => (
        <Form>
          <h2 className="media__heading heading heading--3">Reset password</h2>
          <p>Please enter your new password</p>
          <PasswordField
            className="form__control form__control--has-buttons"
            name="password"
            required
            value={values.password}
          />
          <div className="buttons">
            <button
              className="button button--primary"
              disabled={submitting}
              type="submit"
            >
              {submitting ? <Loading spinner small /> : <span>Reset</span>}
            </button>
          </div>
        </Form>
      )}
    />
  );
}

ForgottenPasswordResetForm.displayName = "ForgottenPasswordResetForm";

import Loading from "components/Loading";
import useIsMounted from "hooks/useIsMounted";
import React, { useCallback, useState } from "react";
import { Formik, Form, Field, FormikHelpers as FormikActions } from "formik";

type SubmitType = (
  values: { password: string },
  actions: FormikActions<{ password: string }>
) => Promise<void>;

type Props = {
  onSubmit: SubmitType;
};

export default function ForgottenPasswordResetForm(props: Props) {
  const { onSubmit } = props;
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
      initialValues={{ password: "" }}
      onSubmit={handleSubmit}
      render={({ values }) => (
        <Form>
          <h2 className="media__heading heading heading--3">Reset password</h2>
          <p>Please enter your new password</p>
          <Field
            className="form__control form__control--has-buttons"
            type="password"
            name="password"
            id="password"
            value={values.password}
            required
          />
          <div className="buttons">
            <button
              type="submit"
              className="button button--primary"
              disabled={submitting}
            >
              {submitting ? <Loading spinner small /> : <span>Reset</span>}
            </button>
          </div>
        </Form>
      )}
    />
  );
}

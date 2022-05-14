import React, {
  useCallback,
} from 'react';
import {
  Formik,
  Form,
  Field,
} from 'formik';
import { useDispatch } from 'react-redux';

import { requestPasswordReset } from 'actions/settings';
import Loading from 'components/Loading';
import { Success } from 'services/BaseMonadicService';

type Props = {
  onSuccess: () => void,
};

export default function PasswordRequestForm({ onSuccess }: Props) {
  const dispatch = useDispatch();

  const handleSubmit = useCallback(async ({ emailAddress }) => {
    const result = await dispatch(requestPasswordReset(emailAddress));
    if (result instanceof Success) {
      onSuccess();
    }
  }, [
    dispatch,
    onSuccess,
  ]);

  return (
    <div>
      <h2 className="media__heading heading heading--3">Reset password</h2>
      <p>Please enter your email address to reset your password</p>
      <Formik
        initialValues={{ emailAddress: '' }}
        onSubmit={handleSubmit}
        render={({ values, dirty, isSubmitting }) => (
          <Form>
            <label htmlFor="emailAddress">Email address: </label>
            <Field
              className="form__control"
              type="email"
              name="emailAddress"
              id="emailAddress"
              value={values.emailAddress}
              autoFocus
            />
            <div style={{ textAlign: 'right', paddingTop: 24 }}>
              <button
                className="button button--primary"
                disabled={!dirty || isSubmitting}
                type="submit"
              >
                {isSubmitting ? (
                  <Loading
                    spinner
                    small
                  />
                ) : <span>Reset password</span>}
              </button>
            </div>
          </Form>
        )}
      />
    </div>
  );
}

import React from 'react';
import classnames from 'classnames';
import {
  Formik,
  Field,
  Form,
  FormikHelpers as FormikActions,
} from 'formik';

import Loading from 'components/Loading';
import Modal from 'components/Modal';

type Props = {
  isOpen: boolean,
  onRequestClose: () => void,
  onSubmit: ({ password }: { password: string}, actions: FormikActions<{ password: string }>) => void,
};

export default function PasswordResetModalComponent(props: Props) {
  const {
    isOpen,
    onSubmit,
    onRequestClose,
  } = props;

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <Formik
        initialValues={{ password: '' }}
        onSubmit={onSubmit}
        render={({ values: { password }, errors, isSubmitting }) => (
          <Form>
            <div>
              <h2 className="media__heading heading heading--3">Reset password</h2>
              <p>Please enter your new password</p>
              <Field
                name="password"
                type="password"
                value={password}
                className={classnames(
                  'form__control form__control--has-validation form__control--has-buttons',
                  errors.password && 'form__control--invalid',
                )}
              />
              <p className="buttons">
                <button
                  className={classnames(
                    'button button--primary',
                    errors.password && 'button--disabled',
                  )}
                  disabled={isSubmitting || errors.password !== undefined}
                  type="submit"
                >
                  {isSubmitting ? <Loading spinner small /> : 'Reset'}
                </button>
              </p>
            </div>
          </Form>
        )}
      />
    </Modal>
  );
}
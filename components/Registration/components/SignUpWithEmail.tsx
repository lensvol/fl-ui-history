import React, { useCallback, useState } from "react";

import { useDispatch } from "react-redux";

import { useHistory } from "react-router-dom";

import classnames from "classnames";

import { Formik, Form, Field } from "formik";

import { signUp } from "actions/registration";

import Loading from "components/Loading";
import PasswordField from "components/Registration/PasswordField";
import redirectAfterLogin from "components/Registration/components/redirectAfterLogin";

import useIsMounted from "hooks/useIsMounted";

export default function SignUpWithEmail() {
  const isMounted = useIsMounted();
  const dispatch = useDispatch();
  const history = useHistory();

  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );

  const handleSubmit = useCallback(
    async (values, { setSubmitting, setErrors }) => {
      setSubmitting(true);

      const result: any = await dispatch(signUp(values));

      if (isMounted.current) {
        setSubmitting(false);
      }

      if (result.isSuccess) {
        redirectAfterLogin(history, {
          hasCharacter: false,
        });
      } else {
        setErrorMessage(result.message);

        setErrors({
          userName: result.userNameErrorMessage,
          emailAddress: result.emailAddressErrorMessage,
          password: result.passwordErrorMessage,
        });
      }
    },
    [dispatch, history, isMounted]
  );

  return (
    <Formik
      initialValues={{
        userName: "",
        emailAddress: "",
        password: "",
      }}
      onSubmit={handleSubmit}
      render={({ values, errors, isSubmitting }) => (
        <Form>
          {errorMessage && (
            <>
              <p className="form__group">
                <div className="form__error">{errorMessage}</div>
              </p>
            </>
          )}
          <p className="form__group">
            <label htmlFor="userName">Username</label>
            <Field
              className="form__control"
              id="userName"
              name="userName"
              required
              type="text"
              value={values.userName}
            />
            {errors.userName && (
              <div className="form__error">{errors.userName}</div>
            )}
          </p>
          <div className="form__group">
            <label htmlFor="emailAddress">Email address</label>
            <Field
              className="form__control"
              id="emailAddress"
              name="emailAddress"
              required
              type="email"
              value={values.emailAddress}
            />
            {errors.emailAddress && (
              <div className="form__error">{errors.emailAddress}</div>
            )}
          </div>
          <p className="form__group">
            <label htmlFor="password">Password</label>
            <PasswordField
              className="form__control"
              name="password"
              required
              value={values.password}
            />
            {errors.password && (
              <div className="form__error">{errors.password}</div>
            )}
          </p>
          <div className="buttons">
            <button
              disabled={isSubmitting}
              type="submit"
              className={classnames(
                "button button--primary",
                isSubmitting && "button--disabled"
              )}
            >
              {isSubmitting ? <Loading spinner small /> : "Sign up"}
            </button>
          </div>
        </Form>
      )}
    />
  );
}

SignUpWithEmail.displayName = "SignUpWithEmail";

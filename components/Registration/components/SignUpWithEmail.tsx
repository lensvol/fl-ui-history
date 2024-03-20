import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import classnames from "classnames";

import { Formik, Form, Field } from "formik";

import { signUp } from "actions/registration";

import Loading from "components/Loading";
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
              name="userName"
              id="userName"
              type="text"
              value={values.userName}
              required
            />
            {errors.userName && (
              <div className="form__error">{errors.userName}</div>
            )}
          </p>
          <div className="form__group">
            <label htmlFor="emailAddress">Email address</label>
            <Field
              className="form__control"
              name="emailAddress"
              id="emailAddress"
              type="email"
              value={values.emailAddress}
              required
            />
            {errors.emailAddress && (
              <div className="form__error">{errors.emailAddress}</div>
            )}
          </div>
          <p className="form__group">
            <label htmlFor="password">Password</label>
            <Field
              className="form__control"
              name="password"
              id="password"
              type="password"
              value={values.password}
              required
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

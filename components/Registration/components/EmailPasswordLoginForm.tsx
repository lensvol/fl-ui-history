import React, { useCallback, useState } from "react";

import { connect, useDispatch } from "react-redux";

import { RouteComponentProps, withRouter } from "react-router-dom";

import { Field, Form, Formik, FormikHelpers as FormikActions } from "formik";

import * as UserActionCreators from "actions/user";

import Loading from "components/Loading";
import RequestPasswordResetModal from "components/RequestPasswordResetModal";
import PasswordField from "components/Registration/PasswordField";

import { IAppState } from "types/app";

interface FormValues {
  emailAddress: string;
  password: string;
  rememberMe: boolean;
}

export function EmailPasswordLoginForm({
  isFetching,
  history,
  location,
}: Props) {
  const dispatch = useDispatch();

  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] =
    useState(false);

  const handleSubmit = useCallback(
    async (values: FormValues, { setErrors }: FormikActions<FormValues>) => {
      const { emailAddress, password, rememberMe } = values;

      // Where does the user want us to keep the access token?
      const storage = rememberMe ? "localStorage" : "sessionStorage";

      // API services will check this to decide where to put the token
      window.sessionStorage.setItem("storage", storage);

      try {
        await dispatch(
          UserActionCreators.loginUser(
            { emailAddress, password },
            location,
            history
          )
        );
      } catch (e) {
        setErrors({ password: "error" });
      }
    },
    [dispatch, history, location]
  );

  return (
    <Formik
      initialValues={{
        emailAddress: "",
        password: "",
        rememberMe: false,
      }}
      onSubmit={handleSubmit}
    >
      {({ values, errors }) => (
        <>
          <Form>
            <p className="form__group">
              <label htmlFor="emailAddress">Email address</label>
              <Field
                className="form__control"
                id="emailAddress"
                name="emailAddress"
                type="email"
                value={values.emailAddress}
              />
            </p>

            <p className="form__group">
              <label htmlFor="password">Password</label>
              <PasswordField
                className="form__control"
                name="password"
                value={values.password}
              />
            </p>

            <div className="login__remember-me-and-submit">
              <span className="login__remember-me">
                <span className="checkbox">
                  <label>
                    <Field
                      checked={values.rememberMe}
                      name="rememberMe"
                      type="checkbox"
                    />{" "}
                    Remember me
                  </label>
                </span>
              </span>
              <button
                className="button button--primary"
                disabled={isFetching}
                type="submit"
              >
                {isFetching ? <Loading spinner small /> : "Log in"}
              </button>
            </div>
            <p>{isFetching ? "Logging in..." : null}</p>
            <p>
              {errors.password
                ? "We were not able to log you in with the credentials you supplied."
                : null}
            </p>
            <p>
              <button
                className="button--link button--link-inverse"
                onClick={() => setIsForgotPasswordModalOpen(true)}
                type="button"
              >
                Forgotten your password?
              </button>
            </p>
          </Form>
          <RequestPasswordResetModal
            isOpen={isForgotPasswordModalOpen}
            onRequestClose={() => setIsForgotPasswordModalOpen(false)}
          />
        </>
      )}
    </Formik>
  );
}

EmailPasswordLoginForm.displayName = "EmailPasswordLoginForm";

const mapStateToProps = (state: IAppState) => ({
  isFetching: state.user.isFetching,
});

type Props = RouteComponentProps & ReturnType<typeof mapStateToProps>;

export default withRouter(connect(mapStateToProps)(EmailPasswordLoginForm));

import React, { useCallback, useEffect, useState } from "react";

import { useHistory, useParams } from "react-router-dom";

import { Form, Formik, Field } from "formik";

import Header from "components/Header";
import Loading from "components/Loading";

import { Failure } from "services/BaseMonadicService";
import UserService, { IUserService } from "services/UserService";

type Params = {
  token?: string;
};

export default function FacebookDataPage() {
  const params = useParams<Params>();
  const token = params.token;
  const confirmationCode = token ? token?.trim() : "";
  const history = useHistory();

  const [isLoading, setIsLoading] = useState(false);
  const [didLoad, setDidLoad] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [contentHtml, setContentHtml] = useState<string | undefined>(undefined);

  const onGoBack = useCallback(() => {
    history.goBack();
  }, [history]);

  const onSubmit = useCallback(async ({ code }: { code?: string }) => {
    if (!code) {
      return;
    }

    setIsLoading(true);

    const paymentService: IUserService = new UserService();
    const result = await paymentService.facebookData(code);

    setHasError(result instanceof Failure);
    setContentHtml(
      result instanceof Failure ? result.message : result.data.message
    );
    setIsLoading(false);
    setDidLoad(true);
  }, []);

  useEffect(() => {
    if (didLoad || confirmationCode.length === 0) {
      // only run once; and only if a confirmation code was supplied
      return;
    }

    onSubmit({
      code: confirmationCode,
    });
  }, [confirmationCode, didLoad, onSubmit]);

  return (
    <>
      <Header />
      <div className="fb-data">
        <h1 className="heading heading--1 credits__navigation">
          <button
            className="button--link"
            onClick={onGoBack}
            style={{
              marginRight: "1rem",
            }}
            type="button"
          >
            <i className="fa fa-arrow-left back-button" />
          </button>
          Facebook Data Status
        </h1>

        <Formik
          initialValues={{
            code: confirmationCode,
          }}
          onSubmit={onSubmit}
        >
          {({ dirty }) => (
            <div>
              <h2 className="heading heading--2">
                Enter your confirmation code here
              </h2>
              <p>
                You should have received it from Facebook when you disconnected
                the app.
              </p>
              <Form>
                <p>
                  <label htmlFor="code">Confirmation Code</label>
                  <Field
                    className="form__control"
                    id="code"
                    name="code"
                    type="text"
                  />
                </p>

                <button
                  className="button button--primary"
                  disabled={!dirty || isLoading}
                  type="submit"
                >
                  {isLoading ? (
                    <Loading spinner small />
                  ) : (
                    <span>Get Status</span>
                  )}
                </button>
              </Form>
            </div>
          )}
        </Formik>

        {isLoading ? (
          <Loading spinner />
        ) : (
          <>
            <div
              className="cms-page"
              dangerouslySetInnerHTML={{ __html: contentHtml ?? "" }}
            />
            {hasError && (
              <div>
                Please contact{" "}
                <a
                  className="error-boundary__p--link"
                  href="mailto:support@failbettergames.com"
                >
                  support@failbettergames.com
                </a>{" "}
                for further assistance.
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

FacebookDataPage.displayName = "FacebookDataPage";

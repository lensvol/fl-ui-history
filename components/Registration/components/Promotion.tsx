import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";

import { Field, Form, Formik, FormikHelpers } from "formik";

import Loading from "components/Loading";

import AccessCodeService from "services/AccessCodeService";

interface FormValues {
  promotionalCode: string;
}

export default function Promotion() {
  const history = useHistory();
  const service = new AccessCodeService();

  const handleSubmit = useCallback(
    async (
      { promotionalCode }: FormValues,
      { setErrors, setSubmitting }: FormikHelpers<FormValues>
    ) => {
      setSubmitting(true);

      const { data } = await service.fetchAccessCode(promotionalCode);

      if (data.isSuccess) {
        history.push("/a/" + encodeURIComponent(promotionalCode));
      } else {
        setErrors({
          promotionalCode: data.message,
        });
      }

      setSubmitting(false);
    },
    [history, service]
  );

  return (
    <>
      <div id="promotion" className="tab-pane active" role="tabpanel">
        <h2 className="heading heading--2 heading--hr">Promotional Code</h2>

        <Formik
          initialValues={{
            promotionalCode: "",
          }}
          onSubmit={handleSubmit}
        >
          {({ values, errors, isSubmitting }) => (
            <>
              <Form>
                <div className="form__group">
                  <label htmlFor="promotionalCode">Enter code</label>
                  <Field
                    className="form__control"
                    id="promotionalCode"
                    name="promotionalCode"
                    required
                    type="text"
                    value={values.promotionalCode}
                  />
                </div>

                <div className="buttons">
                  <button
                    className="button button--primary"
                    disabled={isSubmitting}
                    type="submit"
                  >
                    {isSubmitting ? <Loading spinner small /> : "Redeem"}
                  </button>
                </div>
                <div
                  className="form__error"
                  style={{
                    marginTop: "0.75rem",
                  }}
                >
                  {errors.promotionalCode
                    ? "Sorry, that code is invalid."
                    : null}
                </div>
              </Form>
            </>
          )}
        </Formik>
      </div>
    </>
  );
}

Promotion.displayName = "Promotion";

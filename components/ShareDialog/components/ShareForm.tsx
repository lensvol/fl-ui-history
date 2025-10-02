import React from "react";

import { Field, Form, Formik } from "formik";

import Loading from "components/Loading";

import { stripHtml } from "utils/stringFunctions";

export default function ShareForm({ data, onSubmit, title }: Props) {
  return (
    <Formik
      initialValues={{
        title,
      }}
      onSubmit={onSubmit}
    >
      {({ values, isSubmitting }) => (
        <Form>
          <p className="form__group">
            <Field
              className="form__control"
              name="title"
              value={values.title}
            />
          </p>
          <p className="descriptive">"{stripHtml(data.description)}"</p>
          <div
            style={{
              textAlign: "right",
            }}
          >
            <button
              className="button button--primary"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? <Loading spinner small /> : "Update"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

interface Props {
  data: {
    description: string;
    name: string;
  };
  onSubmit: (...args: any) => void;
  title?: string;
}

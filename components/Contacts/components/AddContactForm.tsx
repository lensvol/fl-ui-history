import React from "react";
import { Formik, Form, Field } from "formik";

type Props = {
  onSubmit: (values: { userName: string }) => Promise<unknown>;
};

export default function AddContactForm({ onSubmit }: Props) {
  return (
    <Formik initialValues={{ userName: "" }} onSubmit={onSubmit}>
      {({ values }) => (
        <Form className="account__add-contact-form">
          <label htmlFor="userName" className="u-visually-hidden">
            Username:
          </label>
          <Field
            name="userName"
            id="userName"
            className="form__control"
            placeholder="Add a contact"
            type="text"
          />
          <button
            className="button button--primary"
            disabled={values.userName === ""}
            type="submit"
          >
            Add
          </button>
        </Form>
      )}
    </Formik>
  );
}

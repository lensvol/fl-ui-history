import React from "react";

import { Field, Form, Formik } from "formik";

type Props = {
  onSubmit: (values: { userName: string }) => Promise<unknown>;
};

export default function AddContactForm({ onSubmit }: Props) {
  return (
    <Formik
      initialValues={{
        userName: "",
      }}
      onSubmit={onSubmit}
    >
      {({ values }) => (
        <Form className="account__add-contact-form">
          <label className="u-visually-hidden" htmlFor="userName">
            Username:
          </label>

          <Field
            className="form__control"
            id="userName"
            name="userName"
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

AddContactForm.displayName = "AddContactForm";

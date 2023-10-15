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

/*
export default function AddContactForm(props: Props) {
  const { userInput, onChange, onSubmit } = props;
  return (
    <form className="account__add-contact-form">
      <label htmlFor="user-friends-name" className="u-visually-hidden">Username:</label>
      <input
        name="userName"
        className="form__control"
        placeholder="Add a contact"
        type="text"
        onChange={onChange}
        value={userInput}
      />
      <button
        className="button button--primary"
        onClick={onSubmit}
        disabled={!userInput}
        type="button"
      >
        Add
      </button>
    </form>
  );
}

AddContactForm.displayName = 'AddContactForm';

 */

/*
AddContactForm.propTypes = {
  userInput: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
 */

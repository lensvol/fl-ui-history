import React from 'react';
import { Formik, Field, Form } from 'formik';

const THEY_SAY_MAX_LENGTH = 150;

export default function TheySayForm(props: Props) {
  const {
    initialValue,
    onSubmit,
  } = props;

  return (
    <Formik
      initialValues={{ description: initialValue }}
      onSubmit={onSubmit}
      render={({ values }) => (
        <Form>
          <Field
            className="form__control"
            rows="4"
            component="textarea"
            maxlength={THEY_SAY_MAX_LENGTH}
            name="description"
            value={values.description}
          />
          <div className="buttons" style={{ marginTop: '.5rem' }}>
            <button className="button button--primary" type="submit">
              Update
            </button>
          </div>
        </Form>
      )}
    />
  );
}

type Props = {
  initialValue: string,
  onSubmit: (values: any) => Promise<void>,
};

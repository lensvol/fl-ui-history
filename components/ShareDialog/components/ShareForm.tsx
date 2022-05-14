import React from 'react';
import * as PropTypes from 'prop-types';
import { Formik, Form, Field } from 'formik';

import { stripHtml } from 'utils/stringFunctions';
import Loading from 'components/Loading';

export default function ShareForm({ data, onSubmit, title }: Props) {
  return (
    <Formik
      initialValues={{ title }}
      onSubmit={onSubmit}
      render={({ values, isSubmitting }) => (
        <Form>
          <p className="form__group">
            <Field
              className="form__control"
              name="title"
              value={values.title}
            />
          </p>
          <p className="descriptive">
            "
            {stripHtml(data.description)}
            "
          </p>
          <div style={{ textAlign: 'right' }}>
            <button
              className="button button--primary"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? <Loading spinner small /> : 'Update'}
            </button>
          </div>
        </Form>
      )}
    />
  );
}

interface Props {
  data: {
    description: string,
    name: string,
  },
  onSubmit: (...args: any) => void,
  title?: string,
}

ShareForm.propTypes = {
  data: PropTypes.shape({
    description: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

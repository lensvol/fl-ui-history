import useIsMounted from 'hooks/useIsMounted';
import React, {
  useCallback,
} from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import {
  Formik,
  Field,
  Form,
  FormikValues,
  FormikHelpers as FormikActions,
} from 'formik';

import Loading from 'components/Loading';

import {
  renameQuality,
} from 'actions/storylet';

// eslint-disable-next-line no-useless-escape
// Preserved for historical interest:
// const DANGEROUS_AND_UNMAINTAINABLE_REGEX = /^(?:(?!([<>.|'&*/\\?:%"+]|(__)|(\s\s))).)*$/;
const ERROR_MESSAGE = 'Names may only contain letters, numbers, spaces, and apostrophes.';

const SIMPLIFIED_REGEX_STRING = '[A-Za-zÀ-ÖØ-öø-ÿ0-9 \']*';

function NameableQualityForm({
  branchId,
  dispatch,
  qualityName,
  qualityPossessedId,
}: Props) {
  const isMounted = useIsMounted();

  const regexp = new RegExp(`^(?:${SIMPLIFIED_REGEX_STRING})$`);

  const handleSubmit = useCallback(async ({ name }: FormikValues, actions: FormikActions<{ name: string }>) => {
    await dispatch(renameQuality({
      branchId,
      qualityPossessedId,
      name: name.trim(), // trim before sending
    }));
    if (isMounted.current) {
      actions.setSubmitting(false);
    }
  }, [
    branchId,
    dispatch,
    isMounted,
    qualityPossessedId,
  ]);

  const validate = useCallback(({ name }: { name: string }) => {
    if (!regexp.test(name)) {
      return { name: ERROR_MESSAGE };
    }
    return {};
  }, [regexp]);

  return (
    <Formik
      initialValues={{ name: '' }}
      onSubmit={handleSubmit}
      validate={validate}
    >
      {({ values, errors, isSubmitting }) => (
        <Form>
          <label htmlFor={`rename-${qualityPossessedId}`}>
            Choose a name for your
            {' '}
            <strong>{qualityName}</strong>
          </label>
          <Field
            type="text"
            maxLength="140"
            id={`rename-${qualityPossessedId}`}
            name="name"
            className={classnames(
              'form__control form__control--has-validation form__control--has-buttons',
              errors.name && 'form__control--invalid',
            )}
            autoComplete="off"
            value={values.name}
            pattern={SIMPLIFIED_REGEX_STRING}
          />
          <p
            className="form__error"
            style={{ color: '#b11818' }}
            aria-live="assertive" // Read out errors immediately
          >
            {errors.name}
          </p>
          <p className="buttons">
            <button
              className={classnames(
                'button button--primary',
                errors.name && 'button--disabled',
              )}
              disabled={isSubmitting || !!errors.name}
              type="submit"
            >
              {isSubmitting ? (
                <Loading
                  spinner
                  small
                />
              ) : <span>Rename</span>}
            </button>
          </p>
        </Form>
      )}
    </Formik>
  );
}

type Props = {
  branchId: number,
  dispatch: Function, // eslint-disable-line
  qualityName: string,
  qualityPossessedId: number,
};

export default connect()(NameableQualityForm);

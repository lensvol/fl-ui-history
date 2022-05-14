import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import classnames from 'classnames';

import { signUp } from 'actions/registration';
import Loading from 'components/Loading';

import {
  ERROR_EMAIL_IN_USE,
} from './constants';

export class SignUpWithEmail extends Component {
  componentDidMount = () => {
    this.mounted = true;
  }

  componentWillUnmount = () => {
    this.mounted = false;
  }

  handleSubmit = async (values, { setSubmitting, setErrors }) => {
    const { dispatch } = this.props;
    setSubmitting(true);
    const result = await dispatch(signUp(values));
    if (this.mounted) {
      setSubmitting(false);
    }
    const { message } = result;
    if (ERROR_EMAIL_IN_USE.test(message)) {
      setErrors({ email: message });
    }
  }

  render = () => (
    <Formik
      initialValues={{
        userName: '',
        emailAddress: '',
        password: '',
      }}
      onSubmit={this.handleSubmit}
      render={({ values, errors, isSubmitting }) => (
        <Form>
          <p className="form__group">
            <label htmlFor="userName">Username</label>
            <Field className="form__control" name="userName" type="text" value={values.userName} required />
            {errors.userName && <div>{errors.userName}</div>}
          </p>
          <div className="form__group">
            <label htmlFor="emailAddress">Email address</label>
            <Field className="form__control" name="emailAddress" type="email" value={values.emailAddress} required />
            {errors.email && <div className="form__error">{errors.email}</div>}
          </div>
          <p className="form__group">
            <label htmlFor="password">Password</label>
            <Field className="form__control" name="password" type="password" value={values.password} required />
          </p>
          <div className="buttons">
            <button
              disabled={isSubmitting}
              type="submit"
              className={classnames('button button--primary', isSubmitting && 'button--disabled')}
            >
              {isSubmitting ? <Loading spinner small /> : 'Sign up'}
            </button>
          </div>
        </Form>
      )}
    />
  )
}

export default connect()(SignUpWithEmail);
import React from 'react';
import PropTypes from 'prop-types';

export default function AddContactForm(props) {
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

AddContactForm.propTypes = {
  userInput: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
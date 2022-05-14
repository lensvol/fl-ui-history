import SuggestContactButton from 'components/Act/components/SuggestContactButton';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  addNewContact,
} from 'actions/storylet';

class AddContactContainer extends Component {
  static propTypes = {
    branchId: PropTypes.number.isRequired,
    onAddContact: PropTypes.func.isRequired,
  }

  state = {
    message: '',
    isSubmitting: false,
    value: '',
  }

  handleChange = (e) => {
    const { message } = this.state;
    this.setState({ value: e.target.value });
    // Clear the message, if it's there
    if (message) {
      this.setState({ message: '' });
    }
  }

  handleSuggestComplete = ({ name }) => {
    this.setState({ value: name });
  }

  handleSubmit = async (e) => {
    const { branchId, dispatch, onAddContact } = this.props;
    const { isSubmitting, value } = this.state;

    // Prevent default submit behaviour
    e.preventDefault();

    // Absolutely don't re-submit if we're currently submitting
    if (isSubmitting) {
      return;
    }

    // Set us to submitting, to disable the UI
    this.setState({ isSubmitting: true });

    // Make the request
    const data = await dispatch(addNewContact({ branchId, username: value }));

    // Get the message and the updated list of eligible friends
    const { addedFriendId, eligibleFriends, message } = data;

    // Call the method we've been passed from ActContainer
    onAddContact({ addedFriendId, eligibleFriends });

    // Update our local state
    this.setState({ message, isSubmitting: false });
  }

  render = () => {
    const { branchId } = this.props;
    const { isSubmitting, message, value } = this.state;
    const onChange = this.handleChange;
    const onSubmit = this.handleSubmit;
    const onSuggestComplete = this.handleSuggestComplete;

    return (
      <form
        className="act__contact-choice-method"
        method="post"
        onSubmit={onSubmit}
      >
        <label
          className="act__contact-choice-label"
          htmlFor="js-add-a-contact"
          style={{ width: '100% ' }}
        >
          Add a contact
          <input
            id="js-add-a-contact"
            type="text"
            className="form__control form__control--no-border act__form-input"
            onChange={onChange}
            value={value}
          />
        </label>
        <p className="act__add-contact-message" dangerouslySetInnerHTML={{ __html: message }} />
        <p className="buttons act__add-and-suggest-buttons">
          <button
            className="button button--primary"
            disabled={value === '' || isSubmitting}
            type="submit"
          >
            {isSubmitting ? 'Adding...' : 'Add'}
          </button>
          <SuggestContactButton
            branchId={branchId}
            onSuggestComplete={onSuggestComplete}
          />
        </p>
      </form>
    );
  }
}

const mapStateToProps = ({
  socialAct: {
    branch: { id: branchId },
  },
}) => ({ branchId });

export default connect(mapStateToProps)(AddContactContainer);

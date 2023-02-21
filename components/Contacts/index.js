import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import Loading from "components/Loading";
import SearchField from "components/SearchField";

import { addContact, addFromFacebook, deleteContact } from "actions/contacts";
import AddContactForm from "./components/AddContactForm";
import ContactsHeader from "./components/ContactsHeader";
import ContactList from "./components/ContactList";

// import * as SettingsActionCreators from '../../actions/settings';

class Contacts extends React.Component {
  static displayName = "Contacts";

  /**
   * State
   * @type {Object}
   */
  state = {
    userInput: "",
    filterString: "",
  };

  /**
   * Handle change
   * @param  {Object} e
   * @return {undefined}
   */
  handleChange = (e) => {
    this.setState({ userInput: e.target.value });
  };

  /**
   * Add new contact
   * @return {undefined}
   */
  addNewContact = (e) => {
    const { dispatch } = this.props;
    const { userInput } = this.state;
    e.preventDefault();

    const userName = userInput;

    if (!userName) {
      return;
    }

    dispatch(addContact(userName));
  };

  /**
   * Delete Contact
   * @param  {Object} contact
   * @return {undefined}
   */
  handleDelete = (contact) => {
    const { dispatch } = this.props;
    if (!contact) {
      return;
    }

    dispatch(deleteContact(contact.id));
  };

  /**
   * Add from facebook
   */
  addFromFacebook = () => {
    const { dispatch } = this.props;
    dispatch(addFromFacebook());
  };

  handleSearchFieldChange = (e) => {
    this.setState({ filterString: e.currentTarget.value });
  };

  /**
   * Render
   * @return {JSX}
   */
  render() {
    const { isFetching, contacts, data, isAdding, message } = this.props;
    const { facebookAuth } = data;
    const { filterString, userInput } = this.state;

    if (isFetching) {
      return <Loading />;
    }

    return (
      <div>
        <ContactsHeader />

        <AddContactForm
          userInput={userInput}
          onChange={this.handleChange}
          onSubmit={this.addNewContact}
        />

        {message && <p dangerouslySetInnerHTML={{ __html: message }} />}

        <SearchField
          placeholder="Search contacts"
          value={filterString}
          onChange={this.handleSearchFieldChange}
        />

        <ContactList
          contacts={contacts}
          filterString={filterString}
          onDelete={this.handleDelete}
        />

        {facebookAuth && (
          <button
            className="button button--primary"
            onClick={this.addFromFacebook}
            type="button"
          >
            {isAdding ? "fetching..." : "Add from Facebook"}
          </button>
        )}
      </div>
    );
  }
}

Contacts.propTypes = {
  contacts: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  data: PropTypes.shape({
    facebookAuth: PropTypes.bool.isRequired,
    twitterAuth: PropTypes.bool.isRequired,
  }).isRequired,
  dispatch: PropTypes.func.isRequired,
  isAdding: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
  message: PropTypes.string,
};

Contacts.defaultProps = {
  message: undefined,
};

const mapStateToProps = ({
  contacts: { contacts, isAdding, isFetching, message },
  settings: { data },
}) => ({
  contacts,
  message,
  isFetching,
  data,
  isAdding,
});

export default withRouter(connect(mapStateToProps)(Contacts));

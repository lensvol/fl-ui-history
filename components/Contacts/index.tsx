import { useAppDispatch, useAppSelector } from "features/app/store";
import React, { useCallback, useState } from "react";

import Loading from "components/Loading";
import SearchField from "components/SearchField";

import { IContact, addContact, deleteContact } from "features/contacts";
import AddContactForm from "./components/AddContactForm";
import ContactsHeader from "./components/ContactsHeader";
import ContactList from "./components/ContactList";

export default function Contacts() {
  const dispatch = useAppDispatch();

  const contacts = useAppSelector((s) => s.contacts.contacts);
  const isFetching = useAppSelector((s) => s.contacts.isFetching);
  // const message = useAppSelector(s => s.contacts.message);

  const [filterString, setFilterString] = useState("");
  const [addContactResponseMessage, setAddContactResponseMessage] =
    useState("");

  const handleAddContactFormSubmit = useCallback(
    async (values: { userName: string }) => {
      try {
        setAddContactResponseMessage("");
        const response = await dispatch(
          addContact({ userName: values.userName })
        ).unwrap();
        setAddContactResponseMessage(response.message);
      } catch (e) {
        if (e.message) {
          console.error(e.message);
          setAddContactResponseMessage(e.message);
        }
      }
    },
    [dispatch]
  );

  const handleDelete = useCallback(
    async (contact: IContact) => {
      try {
        await dispatch(deleteContact({ userID: contact.id })).unwrap();
      } catch (ex) {
        if (ex.message) {
          // NOTE: We should probably surface this error to the user
          console.error(ex.message);
        }
      }
    },
    [dispatch]
  );

  const handleSearchFieldChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      setFilterString(evt.currentTarget.value);
    },
    []
  );

  if (isFetching) {
    return <Loading />;
  }

  return (
    <div>
      <ContactsHeader />

      <AddContactForm onSubmit={handleAddContactFormSubmit} />

      {addContactResponseMessage && (
        <p dangerouslySetInnerHTML={{ __html: addContactResponseMessage }} />
      )}

      <SearchField
        placeholder="Search contacts"
        value={filterString}
        onChange={handleSearchFieldChange}
      />

      <ContactList
        contacts={contacts}
        filterString={filterString}
        onDelete={handleDelete}
      />
    </div>
  );
}

Contacts.displayName = "Contacts";

/*
class Contacts extends React.Component {
  static displayName = 'Contacts';

  state = {
    userInput: '',
    filterString: '',
  };

  handleChange = (e) => {
    this.setState({ userInput: e.target.value });
  };

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

  handleDelete = (contact) => {
    const { dispatch } = this.props;
    if (!contact) {
      return;
    }

    dispatch(deleteContact(contact.id));
  };

  addFromFacebook = () => {
    const { dispatch } = this.props;
    dispatch(addFromFacebook());
  };


  handleSearchFieldChange = (e) => {
    this.setState({ filterString: e.currentTarget.value });
  };

  render() {
    const {
      isFetching, contacts, data, isAdding, message,
    } = this.props;
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
            {isAdding ? 'fetching...' : 'Add from Facebook'}
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
    googleAuth: PropTypes.bool.isRequired,
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
  contacts: {
    contacts, isAdding, isFetching, message,
  },
  settings: { data },
}) => ({
  contacts,
  message,
  isFetching,
  data,
  isAdding,
});

export default withRouter(connect(mapStateToProps)(Contacts));

*/

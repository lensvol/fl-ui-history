import React, { Component } from "react";
import { connect } from "react-redux";

import { addContact } from "actions/contacts";
import { IAppState } from "types/app";

type Props = ReturnType<typeof mapStateToProps> & {
  dispatch: Function;
};

export class AddToContacts extends Component<Props> {
  static displayName = "AddToContacts";

  addContact = () => {
    // Add this character to contacts
    const { dispatch, profileCharacter } = this.props;
    if (profileCharacter) {
      dispatch(addContact(profileCharacter.name));
    }
  };

  canBeAdded = () => {
    const { contacts, loggedIn, isLoggedInUsersProfile, profileCharacter } =
      this.props;
    // If we're not logged in, we can't add contacts
    if (!loggedIn) {
      return false;
    }
    // If we're looking at our own profile, we can't add ourselves
    if (isLoggedInUsersProfile) {
      return false;
    }
    // TODO: If this user is already in our contacts, we can't add them
    if (contacts.find(({ userName }) => userName === profileCharacter?.name)) {
      return false;
    }
    // Otherwise, we can add this user to our contacts
    return true;
  };

  render = () => {
    if (!this.canBeAdded()) {
      return null;
    }
    return (
      <button
        className="button button--primary profile__inventory-switcher"
        onClick={this.addContact}
        type="button"
      >
        Add to Contacts
      </button>
    );
  };
}

const mapStateToProps = ({
  contacts: { contacts },
  profile: { isLoggedInUsersProfile, profileCharacter },
  user: { loggedIn },
}: IAppState) => ({
  contacts,
  isLoggedInUsersProfile,
  loggedIn,
  profileCharacter,
});

export default connect(mapStateToProps)(AddToContacts);

import { ContactsActions } from "actions/contacts";
import {
  ADD_CONTACT_FAILURE,
  ADD_CONTACT_REQUESTED,
  ADD_CONTACT_SUCCESS,
  DELETE_CONTACT_REQUESTED,
  DELETE_CONTACT_FAILURE,
  DELETE_CONTACT_SUCCESS,
  FETCH_CONTACTS_FAILURE,
  FETCH_CONTACTS_REQUESTED,
  FETCH_CONTACTS_SUCCESS,
  ADD_FROM_FACEBOOK_REQUESTED,
  ADD_FROM_FACEBOOK_FAILURE,
  ADD_FROM_FACEBOOK_SUCCESS,
  ADD_FROM_TWITTER_FAILURE,
  ADD_FROM_TWITTER_REQUESTED,
  ADD_FROM_TWITTER_SUCCESS,
} from "actiontypes/contacts";

import addNewContactAndSort from "./addNewContactAndSort";
import { IContactsState } from "types/contacts";

const INITIAL_STATE: IContactsState = {
  contacts: [],
  isAdding: false,
  isDeleting: false,
  isFetching: false,
};

export default function reducer(
  state = INITIAL_STATE,
  action: ContactsActions
) {
  switch (action.type) {
    // Fetch contacts
    case FETCH_CONTACTS_REQUESTED:
      return { ...state, isFetching: true };
    case FETCH_CONTACTS_SUCCESS:
      return {
        ...state,
        error: null,
        isFetching: false,
        contacts: action.payload,
      };
    case FETCH_CONTACTS_FAILURE:
      return {
        ...state,
        isFetching: false,
      };

    // Add contact
    case ADD_CONTACT_REQUESTED:
      return { ...state, isAdding: true };

    case ADD_CONTACT_SUCCESS: {
      // Add the new contact to the list of contacts, then sort it
      const { contact, message } = action.payload;
      return {
        ...state,
        message,
        contacts: addNewContactAndSort(state.contacts, contact),
        isAdding: false,
      };
    }

    case ADD_CONTACT_FAILURE:
      return {
        ...state,
        isAdding: false,
      };

    // Delete contact
    case DELETE_CONTACT_REQUESTED:
      return { ...state, isDeleting: true };

    case DELETE_CONTACT_SUCCESS: {
      const { deletedUserId } = action.payload;
      return {
        ...state,
        isDeleting: false,
        contacts: state.contacts.filter((c) => c.id !== deletedUserId),
      };
    }

    case DELETE_CONTACT_FAILURE:
      return {
        ...state,
        isDeleting: false,
      };

    /* Adding from social networks is the same, regardless of which network */

    case ADD_FROM_FACEBOOK_REQUESTED:
    case ADD_FROM_TWITTER_REQUESTED:
      return { ...state, isAdding: true };

    case ADD_FROM_FACEBOOK_SUCCESS:
    case ADD_FROM_TWITTER_SUCCESS:
      return { ...state, isAdding: false };

    case ADD_FROM_FACEBOOK_FAILURE:
    case ADD_FROM_TWITTER_FAILURE:
      return { ...state, isAdding: false };

    default:
      return state;
  }
}

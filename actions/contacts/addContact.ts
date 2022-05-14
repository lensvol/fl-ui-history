import { handleVersionMismatch } from 'actions/versionSync';
import {
  ADD_CONTACT_FAILURE,
  ADD_CONTACT_REQUESTED,
  ADD_CONTACT_SUCCESS,
} from 'actiontypes/contacts';
import { ActionCreator } from 'redux';
import { VersionMismatch } from 'services/BaseService';
import ContactService from 'services/ContactService';
import { AddContactResponseData } from 'types/contacts';

export type AddContactRequested = { type: typeof ADD_CONTACT_REQUESTED };
export type AddContactFailure = { type: typeof ADD_CONTACT_FAILURE };
export type AddContactSuccess = {
  type: typeof ADD_CONTACT_SUCCESS,
  payload: Pick<AddContactResponseData, 'message' | 'contact'>
};

export type AddContactActions = AddContactRequested | AddContactFailure | AddContactSuccess;

const service = new ContactService();

/** ----------------------------------------------------------------------------
 * ADD NEW CONTACT
 -----------------------------------------------------------------------------*/
export default function addContact(userName: string) {
  return async (dispatch: Function) => {
    dispatch(addContactRequested());

    try {
      const { data } = await service.addContact(userName);
      // If isSuccess is true or missing, then we succeeded
      if (data.isSuccess || !('isSuccess' in data)) {
        return dispatch(addContactSuccess(data));
      }
    } catch (e) {
      if (e instanceof VersionMismatch) {
        dispatch(handleVersionMismatch(e));
      }
      dispatch(addContactFailure(e));
    }
  };
}

export const addContactRequested: ActionCreator<AddContactRequested> = () => ({ type: ADD_CONTACT_REQUESTED });

export const addContactSuccess: ActionCreator<AddContactSuccess> = (data: AddContactResponseData) => ({
  type: ADD_CONTACT_SUCCESS,
  payload: {
    message: data.message,
    contact: data.contact,
  },
});

export const addContactFailure: ActionCreator<AddContactFailure> = (error: any) => ({
  type: ADD_CONTACT_FAILURE,
  // TODO: clean this up
  payload: {
    error: true,
    status: error.response?.status,
    message: error.response?.data?.message,
  },
});
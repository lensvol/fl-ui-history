import { handleVersionMismatch } from "actions/versionSync";
import {
  FETCH_CONTACTS_FAILURE,
  FETCH_CONTACTS_REQUESTED,
  FETCH_CONTACTS_SUCCESS,
} from "actiontypes/contacts";
import { ActionCreator } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { VersionMismatch } from "services/BaseService";
import ContactService from "services/ContactService";
import { IContact } from "types/contacts";

export type FetchContactsRequested = { type: typeof FETCH_CONTACTS_REQUESTED };
export type FetchContactsFailure = { type: typeof FETCH_CONTACTS_FAILURE };
export type FetchContactsSuccess = {
  type: typeof FETCH_CONTACTS_SUCCESS;
  payload: IContact[];
};

export type FetchContactsActions =
  | FetchContactsRequested
  | FetchContactsFailure
  | FetchContactsSuccess;

export const fetchContactsRequested: ActionCreator<
  FetchContactsRequested
> = () => ({ type: FETCH_CONTACTS_REQUESTED });

export const fetchContactsSuccess: ActionCreator<FetchContactsSuccess> = (
  payload: IContact[]
) => ({
  payload,
  type: FETCH_CONTACTS_SUCCESS,
});

export const fetchContactsFailure: ActionCreator<
  FetchContactsFailure
> = () => ({ type: FETCH_CONTACTS_FAILURE });

const service = new ContactService();

export default function fetchContacts() {
  // eslint-disable-next-line consistent-return
  return async (dispatch: ThunkDispatch<any, any, any>) => {
    dispatch(fetchContactsRequested());

    try {
      const { data } = await service.fetch();
      dispatch(fetchContactsSuccess(data));
      return data;
    } catch (error) {
      if (error instanceof VersionMismatch) {
        dispatch(handleVersionMismatch(error));
      }
      dispatch(fetchContactsFailure());
    }
  };
}

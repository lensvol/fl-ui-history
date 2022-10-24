import { handleVersionMismatch } from "actions/versionSync";
import {
  ADD_FROM_TWITTER_FAILURE,
  ADD_FROM_TWITTER_REQUESTED,
  ADD_FROM_TWITTER_SUCCESS,
} from "actiontypes/contacts";
import { VersionMismatch } from "services/BaseService";
import ContactService from "services/ContactService";

import fetchContacts from "./fetchContacts";

const service = new ContactService();

export type AddFromTwitterRequested = {
  type: typeof ADD_FROM_TWITTER_REQUESTED;
};
export type AddFromTwitterFailure = { type: typeof ADD_FROM_TWITTER_FAILURE };
export type AddFromTwitterSuccess = { type: typeof ADD_FROM_TWITTER_SUCCESS };

export type AddFromTwitterActions =
  | AddFromTwitterRequested
  | AddFromTwitterFailure
  | AddFromTwitterSuccess;

/** ----------------------------------------------------------------------------
 * Add Friends from Twitter
 -----------------------------------------------------------------------------*/
export default function addFromTwitter() {
  return async (dispatch: Function) => {
    dispatch(addFromTwitterRequested());

    try {
      const { data } = await service.addTwitterContacts();
      if (data.isSuccess || !("isSuccess" in data)) {
        dispatch(addFromTwitterSuccess(data));
        dispatch(fetchContacts());
        return data;
      }
      // If the API has failed to respect REST semantics and sent back a 200 with
      // an error message, then treat the response as an error
      return Promise.reject({ response: { data: { message: data.message } } });
    } catch (error) {
      if (error instanceof VersionMismatch) {
        dispatch(handleVersionMismatch(error));
      }
      return dispatch(addFromTwitterFailure(error));
    }
  };
}

export const addFromTwitterRequested = () => ({
  type: ADD_FROM_TWITTER_REQUESTED,
  isAdding: true,
});

export const addFromTwitterSuccess = (_?: any) => ({
  type: ADD_FROM_TWITTER_SUCCESS,
});

export const addFromTwitterFailure = (_error?: any) => ({
  type: ADD_FROM_TWITTER_FAILURE,
});

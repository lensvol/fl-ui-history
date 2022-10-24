import { handleVersionMismatch } from "actions/versionSync";
import {
  ADD_FROM_FACEBOOK_REQUESTED,
  ADD_FROM_FACEBOOK_FAILURE,
  ADD_FROM_FACEBOOK_SUCCESS,
} from "actiontypes/contacts";
import { ActionCreator } from "redux";
import { VersionMismatch } from "services/BaseService";
import ContactService from "services/ContactService";
import { BaseResponse } from "types/app";
import fetchContacts from "./fetchContacts";

export type AddFromFacebookRequested = {
  type: typeof ADD_FROM_FACEBOOK_REQUESTED;
};
export type AddFromFacebookFailure = { type: typeof ADD_FROM_FACEBOOK_FAILURE };
export type AddFromFacebookSuccess = { type: typeof ADD_FROM_FACEBOOK_SUCCESS };

export type AddFromFacebookActions =
  | AddFromFacebookRequested
  | AddFromFacebookFailure
  | AddFromFacebookSuccess;

const service = new ContactService();

/** ----------------------------------------------------------------------------
 * Add Friends from Facebook
 -----------------------------------------------------------------------------*/
export default function addFromFacebook() {
  return (dispatch: Function) => {
    dispatch(addFromFacebookRequested());
    return service
      .addFacebookContacts()
      .then(({ data }) => {
        if (data.isSuccess || !("isSuccess" in data)) {
          dispatch(addFromFacebookSuccess(data));
          dispatch(fetchContacts());
          return data;
        }
        // If the API has failed to respect REST semantics and sent back a 200 with
        // an error message, then treat the response as an error
        return Promise.reject({
          response: { data: { message: data.message } },
        });
      })
      .catch((error) => {
        if (error instanceof VersionMismatch) {
          dispatch(handleVersionMismatch(error));
        }
        dispatch(addFromFacebookFailure(error));
      });
  };
}

export const addFromFacebookRequested: ActionCreator<
  AddFromFacebookRequested
> = () => ({
  type: ADD_FROM_FACEBOOK_REQUESTED,
  // isAdding: true,
});

export const addFromFacebookSuccess: ActionCreator<AddFromFacebookSuccess> = (
  data: BaseResponse
) => ({
  type: ADD_FROM_FACEBOOK_SUCCESS,
  payload: {
    message: data.message,
  },
});

export const addFromFacebookFailure: ActionCreator<AddFromFacebookFailure> = (
  error: any
) => ({
  type: ADD_FROM_FACEBOOK_FAILURE,
  payload: {
    error: true,
    message: error.response?.data?.message,
    status: error.response?.status,
  },
});

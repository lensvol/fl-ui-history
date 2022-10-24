import { handleVersionMismatch } from "actions/versionSync";
import {
  DELETE_CONTACT_FAILURE,
  DELETE_CONTACT_REQUESTED,
  DELETE_CONTACT_SUCCESS,
} from "actiontypes/contacts";
import { ActionCreator } from "redux";
import { VersionMismatch } from "services/BaseService";

import ContactService from "services/ContactService";
import { BaseResponse } from "types/app";

export type DeleteContactRequested = { type: typeof DELETE_CONTACT_REQUESTED };
export type DeleteContactFailure = { type: typeof DELETE_CONTACT_FAILURE };
export type DeleteContactSuccess = {
  type: typeof DELETE_CONTACT_SUCCESS;
  payload: {
    deletedUserId: number;
  };
};

export type DeleteContactActions =
  | DeleteContactRequested
  | DeleteContactFailure
  | DeleteContactSuccess;

const service = new ContactService();

/** ----------------------------------------------------------------------------
 * DELETE A CONTACT
 -----------------------------------------------------------------------------*/
export default function deleteContact(userID: number) {
  return async (dispatch: Function) => {
    dispatch(deleteContactRequested());

    try {
      const { data } = await service.deleteContact(userID);
      dispatch(deleteContactSuccess(data, userID));
    } catch (error) {
      if (error instanceof VersionMismatch) {
        dispatch(handleVersionMismatch(error));
        return error;
      }
      dispatch(deleteContactFailure(error));
    }
  };
}

export const deleteContactRequested: ActionCreator<
  DeleteContactRequested
> = () => ({ type: DELETE_CONTACT_REQUESTED, isDeleting: true });

export const deleteContactSuccess: ActionCreator<DeleteContactSuccess> = (
  data: BaseResponse,
  userID: number
) => ({
  type: DELETE_CONTACT_SUCCESS,
  payload: {
    deletedUserId: userID,
    isDeleting: false,
    isSuccess: data.isSuccess,
    message: data.message,
  },
});

export const deleteContactFailure: ActionCreator<DeleteContactFailure> = (
  error: any
) => ({
  type: DELETE_CONTACT_FAILURE,
  payload: {
    isDeleting: false,
    error: true,
    message: error.response?.data?.message,
    status: error.response?.status,
  },
});

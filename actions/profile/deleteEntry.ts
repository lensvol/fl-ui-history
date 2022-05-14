import { handleVersionMismatch } from 'actions/versionSync';
import {
  DELETE_ENTRY_FAILURE,
  DELETE_ENTRY_REQUESTED,
  DELETE_ENTRY_SUCCESS,
} from 'actiontypes/profile';
import * as ProfileActionTypes from 'actiontypes/profile';
import { ActionCreator } from 'redux';
import { Success } from 'services/BaseMonadicService';
import { VersionMismatch } from 'services/BaseService';
import ProfileService, { IProfileService } from 'services/ProfileService';

export type DeleteEntryRequested = { type: typeof DELETE_ENTRY_REQUESTED };

export type DeleteEntryFailure = { type: typeof DELETE_ENTRY_FAILURE };

export type DeleteEntrySuccess = {
  type: typeof DELETE_ENTRY_SUCCESS,
  payload: { toDelete: number },
};

export type DeleteEntryActions = DeleteEntryRequested | DeleteEntryFailure | DeleteEntrySuccess;

export const deleteEntryRequest = () => ({
  type: ProfileActionTypes.DELETE_ENTRY_REQUESTED,
});

export const deleteEntrySuccess: ActionCreator<DeleteEntrySuccess> = (entryId: number) => ({
  type: ProfileActionTypes.DELETE_ENTRY_SUCCESS,
  payload: {
    toDelete: entryId,
  },
});

export const deleteEntryFailure: ActionCreator<DeleteEntryFailure> = (_error?: any) => ({
  type: ProfileActionTypes.DELETE_ENTRY_FAILURE,
});

const service: IProfileService = new ProfileService();

/** ----------------------------------------------------------------------------
 * DELETE ENTRY
 -----------------------------------------------------------------------------*/
export default function deleteEntry(entryId: number) {
  return async (dispatch: Function) => {
    dispatch(deleteEntryRequest());
    try {
      const result = await service.deleteEntry(entryId);
      if (result instanceof Success) {
        dispatch(deleteEntrySuccess(entryId));
      }
      return result;
    } catch (error) {
      if (error instanceof VersionMismatch) {
        dispatch(handleVersionMismatch(error));
      }
      dispatch(deleteEntryFailure(error));
      return error;
    }
  };
}
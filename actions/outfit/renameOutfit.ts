import { handleVersionMismatch } from 'actions/versionSync';
import { RENAME_OUTFIT_SUCCESS } from 'actiontypes/myself';
import { ThunkDispatch } from 'redux-thunk';
import {
  Either,
  Failure,
  Success,
} from 'services/BaseMonadicService';
import { VersionMismatch } from 'services/BaseService';
import OutfitService, { RenameOutfitResponse } from 'services/OutfitService';

export type RenameOutfitSuccess = { type: typeof RENAME_OUTFIT_SUCCESS, payload: { id: number, name: string } };

const renameOutfitSuccess = (id: number, name: string) => ({
  type: RENAME_OUTFIT_SUCCESS,
  payload: { id, name },
});

export default function renameOutfit(id: number, newName: string) {
  return async (
    dispatch: ThunkDispatch<Either<RenameOutfitResponse> | VersionMismatch, any, any>,
  ): Promise<Either<RenameOutfitResponse> | VersionMismatch> => {
    try {
      const result: Success<RenameOutfitResponse> | Failure = await new OutfitService().renameOutfit(id, newName);
      if (result instanceof Success) {
        dispatch(renameOutfitSuccess(id, result.data.message));
      }
      return result;
    } catch (error) {
      if (error instanceof VersionMismatch) {
        dispatch(handleVersionMismatch(error));
        return error;
      }
      throw error;
    }
  };
}
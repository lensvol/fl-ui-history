import { handleVersionMismatch } from "actions/versionSync";
import {
  FETCH_OUTFIT_REQUESTED,
  FETCH_OUTFIT_SUCCESS,
} from "actiontypes/myself";
import { ActionCreator } from "redux";
import { Either, Success } from "services/BaseMonadicService";
import { VersionMismatch } from "services/BaseService";
import OutfitService, { FetchOutfitResponse } from "services/OutfitService";

/** ----------------------------------------------------------------------------
 * FETCH OUTFIT
 -----------------------------------------------------------------------------*/

export default fetchOutfit(new OutfitService());

export function fetchOutfit(
  service: OutfitService
): () => (
  dispatch: Function
) => Promise<Either<FetchOutfitResponse> | VersionMismatch> {
  return () => async (dispatch: Function) => {
    dispatch(fetchOutfitRequested());

    try {
      const result = await service.fetchOutfit();
      if (result instanceof Success) {
        dispatch(fetchOutfitSuccess(result.data));
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

export type FetchOutfitRequestedAction = {
  type: typeof FETCH_OUTFIT_REQUESTED;
};

export type FetchOutfitSuccessAction = {
  type: typeof FETCH_OUTFIT_SUCCESS;
  payload: FetchOutfitResponse;
};

const fetchOutfitRequested: ActionCreator<FetchOutfitRequestedAction> = () => ({
  type: FETCH_OUTFIT_REQUESTED,
});

export const fetchOutfitSuccess: ActionCreator<FetchOutfitSuccessAction> = (
  data: FetchOutfitResponse
) => ({
  type: FETCH_OUTFIT_SUCCESS,
  payload: data,
});

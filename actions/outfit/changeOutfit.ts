import { handleVersionMismatch } from 'actions/versionSync';
import {
  CHANGE_OUTFIT_REQUESTED,
  CHANGE_OUTFIT_SUCCESS,
} from 'actiontypes/myself';
import { clearCache as clearCardCache } from 'actions/cards';
import { clearCache as clearStoryletCache } from 'actions/storylet';
import { fetchPlans } from 'actions/plans';
import { ActionCreator } from 'redux';
import { Either, Success } from 'services/BaseMonadicService';
import { VersionMismatch } from 'services/BaseService';
import OutfitService, { IOutfitService, FetchOutfitResponse } from 'services/OutfitService';

import fetchMyself from 'actions/myself/fetchMyself';

export type ChangeOutfitOptions = {
  clearCacheImmediately: boolean,
};

export type ChangeOutfitRequestedAction = {
  type: typeof CHANGE_OUTFIT_REQUESTED,
  payload: number,
};

export type ChangeOutfitSuccessAction = {
  type: typeof CHANGE_OUTFIT_SUCCESS,
  payload: FetchOutfitResponse,
};

const changeOutfitRequested: ActionCreator<ChangeOutfitRequestedAction> = (outfitId: number) => ({
  type: CHANGE_OUTFIT_REQUESTED,
  payload: outfitId,
});

export const changeOutfitSuccess: ActionCreator<ChangeOutfitSuccessAction> = (data: FetchOutfitResponse) => ({
  type: CHANGE_OUTFIT_SUCCESS,
  payload: data,
});

/** ----------------------------------------------------------------------------
 * CHANGE OUTFIT
 -----------------------------------------------------------------------------*/

const service: IOutfitService = new OutfitService();

export default function changeOutfit(outfitId: number, options?: ChangeOutfitOptions) {
  return async (dispatch: Function): Promise<Either<FetchOutfitResponse> | VersionMismatch> => {
    dispatch(changeOutfitRequested(outfitId));

    if (options?.clearCacheImmediately ?? true) {
      // Because our storylet/card eligibility may have changed, we need to
      // clear the storylet/card cache and fetch the next time we hit the
      // tab. We *don't* directly fetch, because this could lead to sending a
      // character directly to a Menace state because of transient modified Menaces
      dispatch(clearCardCache());
      dispatch(clearStoryletCache());
    }

    try {
      const result = await service.changeOutfit(outfitId);
      if (result instanceof Success) {
        // We've changed outfits
        dispatch(changeOutfitSuccess(result.data));

        // Because our effective highway qualities may have changed, we need to
        // update the plans and myself tab
        dispatch(fetchMyself());
        dispatch(fetchPlans());
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

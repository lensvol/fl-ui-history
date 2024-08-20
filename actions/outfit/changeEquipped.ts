import { ActionCreator } from "redux";

import { fetchMyself } from "actions/myself";
import { clearCache as clearCardCache } from "actions/cards";
import { clearCache as clearStoryletCache } from "actions/storylet";
import { fetchPlans } from "actions/plans";
import { handleVersionMismatch } from "actions/versionSync";

import {
  EQUIP_QUALITY_FAILURE,
  EQUIP_QUALITY_REQUESTED,
  EQUIP_QUALITY_SUCCESS,
} from "actiontypes/myself";
import { ThunkDispatch } from "redux-thunk";
import { Either, Success } from "services/BaseMonadicService";
import { VersionMismatch } from "services/BaseService";
import { ChangeEquipmentResponse } from "services/OutfitService";

export type EquipQualityRequested = { type: typeof EQUIP_QUALITY_REQUESTED };
export type EquipQualityFailure = { type: typeof EQUIP_QUALITY_FAILURE };
export type EquipQualitySuccess = {
  type: typeof EQUIP_QUALITY_SUCCESS;
  payload: ChangeEquipmentResponse;
};

export const equipQualityRequested: ActionCreator<
  EquipQualityRequested
> = () => ({
  type: EQUIP_QUALITY_REQUESTED,
});
export const equipQualityFailure: ActionCreator<EquipQualityFailure> = () => ({
  type: EQUIP_QUALITY_FAILURE,
});
export const equipQualitySuccess: ActionCreator<EquipQualitySuccess> = (
  data: ChangeEquipmentResponse
) => ({
  type: EQUIP_QUALITY_SUCCESS,
  payload: data,
});

type EquipmentChangeAction = (
  qualityId: number
) => Promise<Either<ChangeEquipmentResponse>>;

export default function changeEquipped(action: EquipmentChangeAction) {
  return (qualityId: number) =>
    async (
      dispatch: ThunkDispatch<
        Either<ChangeEquipmentResponse> | VersionMismatch,
        any,
        any
      >
    ) => {
      dispatch(equipQualityRequested());

      // Clear the cache, because storylet and card eligibility may have changed as
      // a result of equipment changes
      dispatch(clearCardCache());
      dispatch(clearStoryletCache());

      try {
        const result: Either<ChangeEquipmentResponse> = await action(qualityId);
        if (result instanceof Success) {
          dispatch(equipQualitySuccess(result.data));

          // Re-fetch plans in case the user has qualified/disqualified themselves
          // for a plan
          dispatch(fetchPlans());
          // Re-fetch /myself so that modified qualities are synced
          dispatch(fetchMyself());
        } else {
          dispatch(equipQualityFailure());
        }
        // Return result so that we can chain on it
        return result;
      } catch (err) {
        if (err instanceof VersionMismatch) {
          dispatch(handleVersionMismatch(err));
          return err;
        }
        throw err;
      }
    };
}

import { ActionCreator } from "redux";
import { ThunkDispatch } from "redux-thunk";

import { fetchActions } from "actions/actions";
import { fetch as fetchCards } from "actions/cards";
import { fetchAvailable } from "actions/storylet";
import { handleVersionMismatch } from "actions/versionSync";

import * as FateActionTypes from "actiontypes/fate";

import { Either, Success } from "services/BaseMonadicService";
import { VersionMismatch } from "services/BaseService";
import FateService, {
  IFateService,
  PurchaseFateItemRequest,
  PurchaseFateItemResponse,
} from "services/FateService";

type PurchaseItemRequested = {
  type: typeof FateActionTypes.PURCHASE_ITEM_REQUESTED;
};

export type PurchaseItemSuccess = {
  type: typeof FateActionTypes.PURCHASE_ITEM_SUCCESS;
  payload: PurchaseFateItemResponse;
};

type PurchaseItemFailure = {
  type: typeof FateActionTypes.PURCHASE_ITEM_FAILURE;
};

export type PurchaseItemActions =
  | PurchaseItemFailure
  | PurchaseItemRequested
  | PurchaseItemSuccess;

const purchaseItemRequested: ActionCreator<PurchaseItemRequested> = () => ({
  type: FateActionTypes.PURCHASE_ITEM_REQUESTED,
  isPurchasing: true,
});

export const purchaseItemSuccess: ActionCreator<PurchaseItemSuccess> = (
  data: PurchaseFateItemResponse
) => ({
  type: FateActionTypes.PURCHASE_ITEM_SUCCESS,
  isPurchasing: false,
  payload: data,
});

const purchaseItemFailure: ActionCreator<PurchaseItemFailure> = (
  error: any
) => ({
  type: FateActionTypes.PURCHASE_ITEM_FAILURE,
  isPurchasing: false,
  error: true,
  status: error.response && error.response.status,
});

/** ----------------------------------------------------------------------------
 * PURCHASE ITEM
 -----------------------------------------------------------------------------*/

export default purchaseItem(new FateService());

export function purchaseItem(
  service: IFateService
): (
  fateData: PurchaseFateItemRequest
) => (
  dispatch: ThunkDispatch<any, any, any>
) => Promise<Either<PurchaseFateItemResponse> | VersionMismatch> {
  return (fateData: PurchaseFateItemRequest) => async (dispatch) => {
    dispatch(purchaseItemRequested());

    try {
      const result = await service.purchaseItem(fateData);

      if (result instanceof Success) {
        const { data } = result;

        dispatch(purchaseItemSuccess(data));
        dispatch(fetchActions());

        // Fetch opp cards and available storylets in case one of them changed
        dispatch(fetchCards({ background: true }));
        dispatch(fetchAvailable());
      }

      return result;
    } catch (error) {
      if (error instanceof VersionMismatch) {
        dispatch(handleVersionMismatch(error));

        return error;
      }

      dispatch(purchaseItemFailure(error));

      throw error;
    }
  };
}

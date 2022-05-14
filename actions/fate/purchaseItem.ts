import { ActionCreator } from 'redux';
import { handleVersionMismatch } from 'actions/versionSync';
import * as FateActionTypes from 'actiontypes/fate';
import { ThunkDispatch } from 'redux-thunk';
import {
  Either,
  Success,
} from 'services/BaseMonadicService';
import { VersionMismatch } from 'services/BaseService';
import FateService, {
  IFateService,
  PurchaseFateItemRequest,
  PurchaseFateItemResponse,
} from 'services/FateService';
import { fetchAvailable } from 'actions/storylet';
import { fetch as fetchCards } from 'actions/cards';

export type PurchaseItemRequested = {
  type: typeof FateActionTypes.PURCHASE_ITEM_REQUESTED,
};

export type PurchaseItemSuccess = {
  type: typeof FateActionTypes.PURCHASE_ITEM_SUCCESS,
  payload: PurchaseFateItemResponse,
};

export type PurchaseItemFailure = {
  type: typeof FateActionTypes.PURCHASE_ITEM_FAILURE,
};

export type PurchaseItemActions = PurchaseItemFailure | PurchaseItemRequested | PurchaseItemSuccess;

export const purchaseItemRequested: ActionCreator<PurchaseItemRequested> = () => ({
  type: FateActionTypes.PURCHASE_ITEM_REQUESTED,
  isPurchasing: true,
});

export const purchaseItemSuccess: ActionCreator<PurchaseItemSuccess> = (data: PurchaseFateItemResponse) => ({
  type: FateActionTypes.PURCHASE_ITEM_SUCCESS,
  isPurchasing: false,
  payload: data,
});

export const purchaseItemFailure: ActionCreator<PurchaseItemFailure> = (error: any) => ({
  type: FateActionTypes.PURCHASE_ITEM_FAILURE,
  isPurchasing: false,
  error: true,
  status: error.response && error.response.status,
});

/** ----------------------------------------------------------------------------
 * PURCHASE ITEM
 -----------------------------------------------------------------------------*/

export default purchaseItem(new FateService());

export function purchaseItem(service: IFateService):
  (fateData: PurchaseFateItemRequest)
    => (dispatch: ThunkDispatch<any, any, any>)
    => Promise<Either<PurchaseFateItemResponse> | VersionMismatch> {
  return (fateData: PurchaseFateItemRequest) => async (dispatch) => {
    dispatch(purchaseItemRequested());

    try {
      const result = await service.purchaseItem(fateData);
      if (result instanceof Success) {
        const { data } = result;
        dispatch(purchaseItemSuccess(data));
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
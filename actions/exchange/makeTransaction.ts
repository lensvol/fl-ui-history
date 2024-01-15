import {
  BuyItemsFailure,
  BuyItemsRequested,
  BuyItemsSuccess,
} from "actions/exchange/buyItems";
import {
  SellItemsFailure,
  SellItemsRequested,
  SellItemsSuccess,
} from "actions/exchange/sellItems";
import { handleVersionMismatch } from "actions/versionSync";
import { ActionCreator } from "redux";
import { Either, Success } from "services/BaseMonadicService";
import { VersionMismatch } from "services/BaseService";
import ExchangeService from "services/ExchangeService";
import { fetchPlans } from "actions/plans";
import { fetchMyself } from "actions/myself";
import { fetchOutfit } from "actions/outfit";
import { fetchAvailable as fetchAvailableStorylets } from "actions/storylet";
import { ITransactionRequest, ITransactionResponse } from "types/exchange";

const service = new ExchangeService();

export type TransactionFailure = BuyItemsFailure | SellItemsFailure;
export type TransactionRequested = BuyItemsRequested | SellItemsRequested;
export type TransactionSuccess = BuyItemsSuccess | SellItemsSuccess;

export type TransactionAction =
  | TransactionFailure
  | TransactionRequested
  | TransactionSuccess;

type TransactionActions = {
  failure: ActionCreator<TransactionFailure>;
  requested: ActionCreator<TransactionRequested>;
  success: ActionCreator<TransactionSuccess>;
};

export default function makeTransaction(
  type: "buy" | "sell",
  actions: TransactionActions
) {
  const { requested, success, failure } = actions;

  const serviceAction: (
    transactionRequest: ITransactionRequest
  ) => Promise<Either<ITransactionResponse>> =
    type === "buy" ? service.buyItems : service.sellItems;

  return (transactionData: ITransactionRequest) =>
    async (dispatch: Function) => {
      dispatch(requested());
      try {
        const result = await serviceAction(transactionData);

        if (result instanceof Success) {
          const { data } = result;
          // Dispatch a 'success' action so that reducers know we've made a transaction
          dispatch(success(data));
          // Because bazaar transactions change our storylet availability, re-fetch available
          // slets
          // TODO(sdob): It is probably a better idea to null out storylet data than fetch,
          // since fetching has side effects
          dispatch(fetchAvailableStorylets());
          // And they also may impact plans, so fetch those as well
          dispatch(fetchPlans());
          // And they also affect our outfit/ourselves
          dispatch(fetchOutfit());
          dispatch(fetchMyself());
        } else {
          dispatch(failure(result));
        }
        return result;
      } catch (err) {
        if (err instanceof VersionMismatch) {
          handleVersionMismatch(err);
        }
        console.error(err);
        return dispatch(failure(err));
      }
    };
}

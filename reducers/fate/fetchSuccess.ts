import { FetchFateSuccess } from "actions/fate/fetch";
import { IFateState } from "reducers/fate";
import calculateEffectiveFate from "./calculateEffectiveFate";
import makeFateRefreshCard from "./makeFateRefreshCard";

export default function fetchSuccess(
  state: IFateState,
  action: FetchFateSuccess
): IFateState {
  const { payload } = action;
  const {
    currentFate,
    currentNex,
    isExceptionalFriend,
    premiumSubExpiryDateTime,
    ...payloadRest
  } = payload;

  return {
    ...state,
    isExceptionalFriend,
    premiumSubExpiryDateTime,
    hasFetched: true,
    isFetching: false,
    data: {
      ...payloadRest,
      actionRefillFateCard: makeFateRefreshCard(payload),
      currentFate: calculateEffectiveFate({ currentFate, currentNex }),
      fateCards: payload.fateCards,
    },
  };
}

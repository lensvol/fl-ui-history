import { PurchaseItemSuccess } from "actions/fate/purchaseItem";
import { IFateState } from "reducers/fate/index";
import calculateEffectiveFate from "./calculateEffectiveFate";
import makeFateRefreshCard from "./makeFateRefreshCard";
import makeEnhancedActionRefreshCard from "./makeEnhancedActionRefreshCard";

export default function purchaseItemSuccess(
  state: IFateState,
  action: PurchaseItemSuccess
): IFateState {
  const { payload } = action;

  return {
    ...state,
    isPurchasing: false,
    data: {
      ...payload,
      actionRefillFateCard: makeFateRefreshCard(payload),
      enhancedActionRefreshCard: makeEnhancedActionRefreshCard(payload),
      currentFate: calculateEffectiveFate(payload),
    },
    purchaseComplete: true,
    message: null,
    remainingStoryUnlocks: payload.remainingStoryUnlocks,
  };
}

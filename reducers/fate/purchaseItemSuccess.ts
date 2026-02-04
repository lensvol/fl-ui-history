import { PurchaseItemSuccess } from "actions/fate/purchaseItem";

import calculateEffectiveFate from "reducers/fate/calculateEffectiveFate";
import { IFateState } from "reducers/fate/index";
import makeEnhancedActionRefreshCard from "reducers/fate/makeEnhancedActionRefreshCard";
import makeFateRefreshCard from "reducers/fate/makeFateRefreshCard";

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
      currentFate: calculateEffectiveFate(payload),
      enhancedActionRefreshCard: makeEnhancedActionRefreshCard(payload),
    },
    message: null,
    purchaseComplete: true,
    remainingStoryUnlocks: payload.remainingStoryUnlocks,
  };
}

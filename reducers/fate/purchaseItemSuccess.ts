import { PurchaseItemSuccess } from 'actions/fate/purchaseItem';
import { IFateState } from 'reducers/fate/index';
import calculateEffectiveFate from './calculateEffectiveFate';
import makeFateRefreshCard from './makeFateRefreshCard';

export default function purchaseItemSuccess(state: IFateState, action: PurchaseItemSuccess): IFateState {
  const { payload } = action;

  return {
    ...state,
    isPurchasing: false,
    data: {
      ...payload,
      actionRefillFateCard: makeFateRefreshCard(payload),
      currentFate: calculateEffectiveFate(payload),
    },
    purchaseComplete: true,
    message: null,
  };
}
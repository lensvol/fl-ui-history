import { TransactionSuccess } from "actions/exchange/makeTransaction";
import { IExchangeState } from "types/exchange";

export default function updateShopItems(
  state: IExchangeState,
  action: TransactionSuccess
) {
  const { shops } = state;
  const { isSuccess, possessionsChanged: changes } = action.payload;

  if (!isSuccess) {
    return shops;
  }

  // Get the IDs of qualities that are now 0 as a result of this transaction
  const zeroedIds = changes.filter((_) => _.level === 0).map((_) => _.id);

  // Update the shop cache
  return {
    ...shops,
    null: {
      ...shops.null,
      items: shops.null.items.filter(
        (_) => !zeroedIds.includes(_.availability.quality.id)
      ),
    },
  };
}

import { EXCLUDED_FATE_ACTIONS } from "constants/fate";
import { createSelector } from "reselect";
import { IAppState } from "types/app";
import { IFateCard } from "types/fate";
import { isNotUndefined } from "utils";

const getFateCards = ({
  fate: {
    data: { fateCards },
  },
}: IAppState) => fateCards;

function outputFunc(fateCards: ReturnType<typeof getFateCards>): IFateCard[] {
  // Ensure we have no duplicates, even if the API returned multiple
  const uniqueIds = [...Array.from(new Set(fateCards.map(({ id }) => id)))];
  return uniqueIds
    .map((id) => fateCards.find((card) => id === card.id))
    .filter(isNotUndefined) // Narrrow to IFateCard[]
    .filter((item) => EXCLUDED_FATE_ACTIONS.indexOf(item.action) < 0) // Hide OutfitPurchase
    .filter((item) => !item.hidden); // Hide anything marked as hidden
}

const selector = createSelector([getFateCards], outputFunc);

export default selector;

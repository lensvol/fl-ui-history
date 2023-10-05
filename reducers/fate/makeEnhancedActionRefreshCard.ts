import { ENHANCED_REFRESH_ACTIONS } from "constants/fate/fateActions";

import { FetchFateResponse } from "services/FateService";

import { MultipleChoiceEnhancedActionRefreshCard } from "types/fate";

export default function makeEnhancedActionRefreshCard(
  payload: FetchFateResponse
): MultipleChoiceEnhancedActionRefreshCard {
  const { fateCards } = payload;

  return {
    id: 0,
    image: "fate_candledouble_exceptional",
    name: "Use your Enhanced Refreshes",
    description:
      "As an Enhanced Exceptional Friend, you can refresh 7 actions 3 times each month.",
    action: ENHANCED_REFRESH_ACTIONS,
    price: 1,
    type: "Digital",
    canAfford: true,
    border: "Gold",
    buttons: [
      {
        description: "Refresh 7 Actions",
        correspondingActivePurchase: fateCards.find(({ id }) => id === 277),
      },
    ],
  };
}

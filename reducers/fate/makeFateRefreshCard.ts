import { FetchFateResponse } from "services/FateService";
import { MultipleChoiceActionRefillFateCard } from "types/fate";

export default function makeFateRefreshCard(
  payload: FetchFateResponse
): MultipleChoiceActionRefillFateCard {
  const { fateCards } = payload;
  return {
    id: 0,
    image: "fate_candledouble_exceptional",
    name: "Refresh your Actions with Fate",
    description: "Restore 6 Actions for 4 Fate or 20 Actions for 10 Fate",
    hidden: true,
    action: "RefillActions",
    price: [4, 10],
    type: "Digital",
    canAfford: true,
    border: "Gold",
    buttons: [
      {
        description: "Refresh 6 Actions",
        correspondingActivePurchase: fateCards.find(({ id }) => id === 7),
      },
      {
        description: "Refresh 20 Actions",
        correspondingActivePurchase: fateCards.find(({ id }) => id === 6),
      },
    ],
  };
}

import { FetchCardsResponse } from 'services/CardsService';

export default function formatPayload({
  displayCards,
  eligibleForCardsCount,
  maxHandSize,
  maxDeckSize,
  // timeDifference,
  ...rest
}: // {
  // displayCards: any[],
  // eligibleForCardsCount: number,
  // maxHandSize: number,
  // maxDeckSize: number,
  // timeDifference: number
//}
FetchCardsResponse) {
  return {
    ...rest,
    // timeDifference,
    deckSize: maxDeckSize,
    displayCards,
    cardsCount: eligibleForCardsCount,
    handSize: maxHandSize,
  };
}
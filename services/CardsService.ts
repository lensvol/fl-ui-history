import { ICard } from "types/cards";
import BaseService, { Either } from "./BaseMonadicService";

export interface ICardsService {
  fetchOpportunityCards: () => Promise<Either<FetchCardsResponse>>;
  discardOpportunityCard: (
    eventId: number
  ) => Promise<Either<DiscardCardResponse>>;
  drawOpportunityCards: () => Promise<Either<DrawCardsResponse>>;
}

export type FetchCardsResponse = {
  currency: number;
  currentTime: string;
  displayCards: ICard[];
  eligibleForCardsCount: number;
  isInAStorylet: boolean;
  maxHandSize: number;
  maxDeckSize: number;
  nextActionAt: string;
};

export type DiscardCardResponse = FetchCardsResponse & {};

export type DrawCardsResponse = FetchCardsResponse & {};

class CardsService extends BaseService implements ICardsService {
  /**
   * fetch Opportunity Cards
   * @return {Promise}
   */
  fetchOpportunityCards: () => Promise<Either<FetchCardsResponse>> = () => {
    const config = {
      method: "get",
      url: "/opportunity",
    };
    return this.doRequest<FetchCardsResponse>(config);
  };

  discardOpportunityCard: (
    eventId: number
  ) => Promise<Either<DiscardCardResponse>> = (eventId: number) => {
    const config = {
      method: "post",
      url: "/opportunity/discard",
      data: { eventId },
    };

    return this.doRequest<DiscardCardResponse>(config);
  };

  /**
   * Draw opportunity cards
   * @return {Promise}
   */
  drawOpportunityCards: () => Promise<Either<DrawCardsResponse>> = () => {
    const config = {
      method: "post",
      url: "/opportunity/draw",
    };
    return this.doRequest<DrawCardsResponse>(config);
  };
}

export { CardsService as default };

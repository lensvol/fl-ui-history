import BaseService, { Either } from "services/BaseMonadicService";

import { IFateCard } from "types/fate";

export interface IFateService {
  fetchFate: () => Promise<Either<FetchFateResponse>>;
  purchaseItem: (
    data: PurchaseFateItemRequest
  ) => Promise<Either<PurchaseFateItemResponse>>;
}

export type FetchFateResponse = {
  currentFate: number;
  currentNex: number;
  fateCards: IFateCard[];
  isExceptionalFriend: boolean;
  premiumSubExpiryDateTime: string;
  remainingStoryUnlocks?: number;
};

export type PurchaseFateItemRequest = {
  storeItemId: number;
  avatarImage?: string | null;
  newName?: string | null;
  action?: string;
  isFree?: boolean;
};

export type PurchaseFateItemResponse = FetchFateResponse;

export default class FateService extends BaseService implements IFateService {
  fetchFate = () => {
    const config = {
      method: "get",
      url: "/fate",
    };

    return this.doRequest(config);
  };

  purchaseItem = (data: PurchaseFateItemRequest) => {
    const {
      action,
      avatarImage = null,
      newName = null,
      storeItemId,
      isFree,
    } = data;

    const config = {
      method: "post",
      url: "/fate/purchase",
      data: {
        action,
        avatarImage,
        newName,
        storeItemId,
        isFree,
      },
    };

    return this.doRequest<PurchaseFateItemResponse>(config);
  };
}

import BaseService, { Either } from "services/BaseMonadicService";

import { IFateCard } from "types/fate";

export interface IFateService {
  changeAvatar: (avatarName: string) => Promise<Either<ChangeAvatarResponse>>;
  fetchFate: () => Promise<Either<FetchFateResponse>>;
  purchaseItem: (
    data: PurchaseFateItemRequest
  ) => Promise<Either<PurchaseFateItemResponse>>;
}

export type ChangeAvatarResponse = FetchFateResponse;

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
    const { action, avatarImage = null, newName = null, storeItemId } = data;

    const config = {
      method: "post",
      url: "/fate/purchase",
      data: {
        action,
        avatarImage,
        newName,
        storeItemId,
      },
    };

    return this.doRequest<PurchaseFateItemResponse>(config);
  };

  changeAvatar = (avatarImage: string) => {
    const config = {
      method: "post",
      url: "/fate/changeavatar",
      data: {
        avatarImage,
      },
    };

    return this.doRequest<ChangeAvatarResponse>(config);
  };
}

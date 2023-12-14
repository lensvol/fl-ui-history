import { IFateCard } from "types/fate";
import BaseService, { Either } from "./BaseMonadicService";

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

class FateService extends BaseService implements IFateService {
  /**
   * Fetch
   * @return {Promise}
   */
  fetchFate = () => {
    const config = {
      method: "get",
      url: "/fate",
    };
    return this.doRequest(config);
  };

  /**
   * Purchase Item
   * @param  {Object} data
   * @return {Promise}
   */
  purchaseItem = (data: PurchaseFateItemRequest) => {
    const { storeItemId, newName = null, avatarImage = null, action } = data;

    const config = {
      method: "post",
      url: "/fate/purchase",
      data: {
        storeItemId,
        newName,
        avatarImage,
        action,
      },
    };
    return this.doRequest<PurchaseFateItemResponse>(config);
  };

  changeAvatar = (avatarImage: string) => {
    const config = {
      method: "post",
      url: "/fate/changeavatar",
      data: { avatarImage },
    };
    return this.doRequest<ChangeAvatarResponse>(config);
  };
}

export { FateService as default };

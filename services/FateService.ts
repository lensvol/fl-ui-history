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
};

export type PurchaseFateItemRequest = {
  storeItemId: number;
  avatarImage?: string | null;
  newName?: string | null;
};

export type PurchaseFateItemResponse = FetchFateResponse;

class FateService extends BaseService implements IFateService {
  /**
   * Fetch
   * @return {Promise}
   */
  fetchFate = () => {
    const config = {
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
    const { storeItemId, newName = null, avatarImage = null } = data;

    const config = {
      method: "post",
      url: "/fate/purchase",
      data: {
        storeItemId,
        newName,
        avatarImage,
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

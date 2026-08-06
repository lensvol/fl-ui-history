import BaseService, { Either } from "services/BaseMonadicService";

import { JournalTagEntry } from "types/journal";
import { AreaWithNestedJsonInfo } from "types/map";
import { IQuality } from "types/qualities";

export type FetchProfileResponse = {
  isLoggedInUsersProfile: boolean;
  characterName: string;
  currentArea: AreaWithNestedJsonInfo;
  profileCharacter: IProfileCharacter;
  standardEquippedPossessions: {
    possessions: IQuality[];
  };
  profileName?: string;
  profileDescription?: string;
  profileBanner?: string;
  outfitName?: string;
  hasFavouredOutfit?: boolean;
};

export interface ApiSharedContent {
  id: number;
  eventName: string;
  areaName: string;
  fallenLondonDateTime: string;
  playerMessage: string;
  tags?: JournalTagEntry[];
}

export type UpdateDescriptionResponse = {
  message: string;
};

export type ShareResponse = {
  message: string;
};

export interface IProfileCharacter {
  avatarImage: string;
  currentDomicile?: Domicile;
  description: string;
  descriptiveText: string;
  frameImage?: string;
  mantelpieceItem?: IQuality;
  scrapbookStatus?: IQuality;
  name: string;
  userName?: string;
}

type Domicile = {
  name: string;
  description: string;
  image: string;
  maxHandSize: number;
};

export type ShareContentRequest = {
  contentClass: string;
  contentKey: string;
  image: string;
  message: string;
};

export interface IProfileService {
  fetchProfile: (
    characterName: string
  ) => Promise<Either<FetchProfileResponse>>;
  share: (req: ShareContentRequest) => Promise<Either<ShareResponse>>;
  updateDescription: (
    newDescription: string
  ) => Promise<Either<UpdateDescriptionResponse>>;
}

export default class ProfileService
  extends BaseService
  implements IProfileService
{
  fetchProfile = (characterName: string) => {
    let url = `/profile?characterName=${encodeURIComponent(characterName ?? "")}`;

    const config = {
      method: "get",
      url,
    };

    return this.doRequest<FetchProfileResponse>(config);
  };

  updateDescription = (newDescription: string) => {
    const config = {
      method: "post",
      url: "/profile/update",
      data: {
        newDescription,
      },
    };

    return this.doRequest<UpdateDescriptionResponse>(config);
  };

  share = (request: ShareContentRequest) => {
    const { contentClass, contentKey, image, message } = request;

    const config = {
      method: "post",
      url: "/profile/share",
      data: {
        contentClass,
        image,
        message,
        contentKey,
      },
    };

    return this.doRequest<ShareResponse>(config);
  };
}

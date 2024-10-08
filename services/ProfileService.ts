// @ts-ignore
import querystring from "query-string";
import { AreaWithNestedJsonInfo } from "types/map";
import { IQuality } from "types/qualities";
import BaseService, { Either } from "./BaseMonadicService";

export type DeleteEntryResponse = {
  message: string;
};

export type FetchProfileResponse = {
  isLoggedInUsersProfile: boolean;
  characterName: string;
  currentArea: AreaWithNestedJsonInfo;
  profileCharacter: IProfileCharacter;
  standardEquippedPossessions: { possessions: IQuality[] };
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
  isFavourite: boolean;
}

export type FetchSharedContentResponse = {
  shares: ApiSharedContent[];
  next?: string;
  prev?: string;
};

export type UpdateDescriptionResponse = {
  message: string;
};

export type ShareResponse = {
  message: string;
};

export interface FetchSharedContentRequest {
  characterName: string;
  date?: any;
  fromId?: any;
}

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

export type Domicile = {
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
  deleteEntry: (entryId: number) => Promise<Either<DeleteEntryResponse>>;
  fetchProfile: (
    characterName: string,
    fromEchoId?: string | number
  ) => Promise<Either<FetchProfileResponse>>;
  fetchSharedContent: (
    args: FetchSharedContentRequest
  ) => Promise<Either<FetchSharedContentResponse>>;
  fetchSharedContentByUrl: (
    url: string
  ) => Promise<Either<FetchSharedContentResponse>>;
  share: (req: ShareContentRequest) => Promise<Either<ShareResponse>>;
  toggleFavouriteJournalEntry: (id: number) => Promise<Either<ShareResponse>>;
  updateDescription: (
    newDescription: string
  ) => Promise<Either<UpdateDescriptionResponse>>;
}

class ProfileService extends BaseService implements IProfileService {
  fetchProfile = (characterName: string, fromEchoId?: string | number) => {
    let url = `/profile?characterName=${characterName ?? ""}`;
    if (fromEchoId) {
      url += `/${fromEchoId}`;
    }

    const config = {
      method: "get",
      url,
    };
    return this.doRequest<FetchProfileResponse>(config);
  };

  deleteEntry = (entryId: number) => {
    const config = {
      method: "post",
      url: "/profile/delete",
      data: { entryId },
    };
    return this.doRequest<DeleteEntryResponse>(config);
  };

  fetchSharedContent = ({
    characterName,
    date,
    fromId,
  }: FetchSharedContentRequest) => {
    const qs = querystring.stringify({
      characterName,
      date,
      fromId,
    });
    const config = {
      method: "get",
      url: `/profile/shares?${qs}`,
    };
    return this.doRequest<FetchSharedContentResponse>(config);
  };

  fetchSharedContentByUrl = (url: string) => {
    const config = { url };
    return this.doRequest<FetchSharedContentResponse>(config);
  };

  toggleFavouriteJournalEntry = (id: number) => {
    const config = {
      method: "post",
      url: "/profile/toggleFavourite",
      data: { id },
    };

    return this.doRequest<ShareResponse>(config);
  };

  updateDescription = (newDescription: string) => {
    const config = {
      method: "post",
      url: "/profile/update",
      data: { newDescription },
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

export { ProfileService as default };

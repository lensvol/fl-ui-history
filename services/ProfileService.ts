// @ts-ignore
import querystring from "query-string";
import { AreaWithNestedJsonInfo } from "types/map";
import { IProfileCharacter } from "types/profile";
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
  standardEquippedPossessions: { name: string; possessions: IQuality[] };
  expandedEquippedPossessions: { name: string; possessions: IQuality[] };
};

export type FetchSharedContentResponse = {
  shares: {
    id: number;
    eventName: string;
    areaName: string;
    fallenLondonDateTime: string;
    playerMessage: string;
  }[];
  next?: string;
  prev?: string;
};

export type UpdateDescriptionResponse = {
  message: string;
};

export type ShareResponse = {
  message: string;
};

export interface FetchSharedContentArgs {
  characterName: string;
  count?: any;
  date?: any;
  fromId?: any;
  offset?: any;
}

export interface IProfileService {
  deleteEntry: (entryId: number) => Promise<Either<DeleteEntryResponse>>;
  fetchProfile: (
    characterName: string,
    fromEchoId?: string | number
  ) => Promise<Either<FetchProfileResponse>>;
  fetchSharedContent: (
    args: FetchSharedContentArgs
  ) => Promise<Either<FetchSharedContentResponse>>;
  fetchSharedContentByUrl: (
    url: string
  ) => Promise<Either<FetchSharedContentResponse>>;
  share: (
    contentClass: any,
    contentKey: any,
    image: any,
    message: any
  ) => Promise<Either<ShareResponse>>;
  updateDescription: (
    newDescription: string
  ) => Promise<Either<UpdateDescriptionResponse>>;
}

class ProfileService extends BaseService implements IProfileService {
  fetchProfile = (characterName: string, fromEchoId?: string | number) => {
    let url = `/profile?characterName=${characterName}`;
    if (fromEchoId) {
      url += `/${fromEchoId}`;
    }

    const config = {
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
    count,
    date,
    fromId,
    offset,
  }: any) => {
    const qs = querystring.stringify({
      characterName,
      date,
      fromId,
      offset,
      count,
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

  updateDescription = (newDescription: string) => {
    const config = {
      method: "post",
      url: "/profile/update",
      data: { newDescription },
    };
    return this.doRequest(config);
  };

  share = (contentClass: any, contentKey: any, image: any, message: any) => {
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

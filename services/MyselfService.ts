import { VersionMismatch } from "services/BaseService";
import { IQuality } from "types/qualities";
import BaseService, { Either } from "./BaseMonadicService";
import {
  IFetchMyselfResponseData,
  IScrapbookMantelpieceResponse,
} from "types/myself";

type SetJournalPrivacyResponse = { journalIsPrivate: boolean };

export type SetAvatarImageResponse = {
  message: string;
  possessionsChanged: IQuality[];
};

export interface IMyselfService {
  chooseNewMantelpiece: (q: {
    id: number;
  }) => Promise<Either<IScrapbookMantelpieceResponse> | VersionMismatch>;
  chooseNewScrapbook: (q: {
    id: number;
  }) => Promise<Either<IScrapbookMantelpieceResponse> | VersionMismatch>;
  fetchMyself: () => Promise<
    Either<IFetchMyselfResponseData> | VersionMismatch
  >;
  setAvatarImage: ({
    avatarImage,
  }: {
    avatarImage: string;
  }) => Promise<Either<SetAvatarImageResponse> | VersionMismatch>;
  setJournalPrivacy: (
    isPrivate: boolean
  ) => Promise<Either<SetJournalPrivacyResponse> | VersionMismatch>;
}

export default class MyselfService
  extends BaseService
  implements IMyselfService
{
  fetchMyself = () => {
    const config = {
      url: "/character/myself",
    };
    return this.doRequest<IFetchMyselfResponseData>(config);
  };

  /**
   * Choose new scrapbook
   * @param  {Object} item
   * @return {undefined}
   */
  chooseNewScrapbook = (item: { id: number } | null = null) => {
    const config = {
      method: "post",
      url: `/character/scrapbook/${item?.id ?? null}`,
    };
    return this.doRequest<IScrapbookMantelpieceResponse>(config);
  };

  /**
   * [chooseNewMantelpiece description]
   * @param  {[type]} [item=null] [description]
   * @return {[type]}             [description]
   */
  chooseNewMantelpiece = (item: { id: number } | null = null) => {
    const config = {
      method: "post",
      url: `/character/mantelpiece/${item?.id ?? null}`,
    };
    return this.doRequest<IScrapbookMantelpieceResponse>(config);
  };

  setAvatarImage = ({ avatarImage }: { avatarImage: string }) => {
    const config = {
      method: "post",
      url: "/character/setavatarimage",
      data: { avatarImage },
    };
    return this.doRequest<SetAvatarImageResponse>(config);
  };

  saveOutfit = () => {
    const config = {
      method: "post",
      url: "/outfit/save",
    };
    console.warn(
      "MyselfService.saveOutfit() is deprecated and will fail when the API updates."
    );
    return this.doRequest<any>(config);
  };

  setJournalPrivacy = (isPrivate: boolean) => {
    const config = {
      method: "post",
      url: `/character/profileprivacy/${isPrivate}`,
    };

    return this.doRequest<any>(config);
  };
}

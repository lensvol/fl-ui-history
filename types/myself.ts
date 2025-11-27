import { AxiosResponse } from "axios";

import { ISetting } from "types/map";
import { IOutfit } from "types/outfit";
import { IQuality } from "types/qualities";

export enum UIRestriction {
  None,
  EchoBazaar,
  Extras,
  Fate,
  Messages,
  Possessions,
  Travel,
  Agents,
}

export interface IMyselfState {
  character: {
    avatarImage: string;
    name: string;
    outfits: IOutfit[];
    currentDomicile: Partial<ICurrentDomicile>;
    description?: string;
    descriptiveText?: string;
    id?: number;
    journalIsPrivate: boolean;
    mantelpieceItemId?: number;
    scrapbookStatusId?: number;
    setting: ISetting | undefined;
  };
  hasFetched: boolean;
  isFetching: boolean;
  isRequestingItemUse: boolean;
  qualities: IQuality[];
  categories: {
    name: string;
    categories: string[];
    qualities: number[];
    image?: string;
  }[];
  showJournalView: boolean;
  uiRestrictions?: UIRestriction[];
}

export interface ICurrentDomicile {
  name: string;
  description: string;
  image: string;
  maxHandSize: number;
}

export interface IFetchMyselfResponse extends AxiosResponse<IFetchMyselfResponseData> {
  data: IFetchMyselfResponseData;
}

export interface IFetchMyselfResponseData {
  character: {
    outfits: IOutfit[];
    mantelpieceItem?: IQuality;
    scrapbookStatus?: IQuality;
    setting: ISetting;
  };
  possessions: {
    categories: string[];
    name: string;
    possessions: IQuality[];
    image?: string;
  }[];
  restrictedUserInterfaceElements?: string[];
}

export type IScrapbookMantelpieceResponse = {
  data: IQuality;
};

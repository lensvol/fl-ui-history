import { AxiosResponse } from "axios";
import { ISetting } from "types/map";
import { IQuality } from "types/qualities";
import { IOutfit } from "types/outfit";

export enum UIRestriction {
  None,
  EchoBazaar,
  Extras,
  Fate,
  Messages,
  Possessions,
  Travel,
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
  }[];
  uiRestrictions?: UIRestriction[];
}

export interface ICurrentDomicile {
  name: string;
  description: string;
  image: string;
  maxHandSize: number;
}

export interface IFetchMyselfResponse
  extends AxiosResponse<IFetchMyselfResponseData> {
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
    appearance: string;
    name: string;
    possessions: IQuality[];
  }[];
  restrictedUserInterfaceElements?: string[];
}

export type IScrapbookMantelpieceResponse = { data: IQuality };

import BaseService, { Either } from "services/BaseMonadicService";

export type FetchOutfitResponse = {
  dirty: boolean;
  isFavourite: boolean;
  maxOutfits: number;
  slots: { name: string; qualityId?: number }[];
};

export type RenameOutfitResponse = {
  message: string;
};

export type ChangeEquipmentResponse = FetchOutfitResponse & {};

export interface IOutfitService {
  changeOutfit: (outfitId: number) => Promise<Either<FetchOutfitResponse>>;
  equipQuality: (qualityId: number) => Promise<Either<ChangeEquipmentResponse>>;
  fetchOutfit: () => Promise<Either<FetchOutfitResponse>>;
  renameOutfit: (
    outfitId: number,
    newName: string
  ) => Promise<Either<RenameOutfitResponse>>;
  saveCurrentOutfit: () => Promise<Either<FetchOutfitResponse>>;
  toggleFavouriteOutfit: () => Promise<Either<FetchOutfitResponse>>;
  unequipQuality: (
    qualityId: number
  ) => Promise<Either<ChangeEquipmentResponse>>;
}

export default class OutfitService
  extends BaseService
  implements IOutfitService
{
  changeOutfit = (id: number) => {
    const config = {
      method: "post",
      url: "/outfit/change",
      data: { outfitId: id },
    };
    return this.doRequest<FetchOutfitResponse>(config);
  };

  equipQuality = (id: number) => {
    const config = {
      method: "post",
      url: "/outfit/equip",
      data: { qualityId: id },
    };
    return this.doRequest<ChangeEquipmentResponse>(config);
  };

  fetchOutfit = () => {
    const config = { url: "/outfit" };
    return this.doRequest<FetchOutfitResponse>(config);
  };

  renameOutfit = (outfitId: number, newName: string) => {
    const config = {
      method: "post",
      url: "/outfit/rename",
      data: { outfitId, newName },
    };
    return this.doRequest<RenameOutfitResponse>(config);
  };

  saveCurrentOutfit = () => {
    const config = {
      method: "post",
      url: "/outfit/save",
    };
    return this.doRequest<FetchOutfitResponse>(config);
  };

  toggleFavouriteOutfit = () => {
    const config = {
      method: "post",
      url: "/outfit/toggleFavourite",
    };

    return this.doRequest<FetchOutfitResponse>(config);
  };

  unequipQuality = (qualityId: number) => {
    const config = {
      method: "post",
      url: "/outfit/unequip",
      data: { qualityId },
    };
    return this.doRequest<ChangeEquipmentResponse>(config);
  };
}

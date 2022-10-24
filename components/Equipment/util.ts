/* eslint-disable import/prefer-default-export */
import { OUTFIT_TYPE_ORDERING } from "constants/outfits";
import { IOutfit } from "types/outfit";

export const compareOutfits = (a: IOutfit, b: IOutfit) =>
  OUTFIT_TYPE_ORDERING[a.type] - OUTFIT_TYPE_ORDERING[b.type];

import { OUTFIT_TYPE_ORDERING } from "constants/outfits";
import { createSelector } from "reselect";
import { IAppState } from "types/app";
import { IOutfit } from "types/outfit";

const getOutfits = (state: IAppState) => state.myself.character.outfits;

const outputFn = (outfits: IOutfit[]) => [...outfits].sort(compareOutfits);

export default createSelector([getOutfits], outputFn);

function compareOutfits(a: IOutfit, b: IOutfit) {
  const sortOrderA = OUTFIT_TYPE_ORDERING[a.type];
  const sortOrderB = OUTFIT_TYPE_ORDERING[b.type];

  if (sortOrderA === sortOrderB) {
    return a.id - b.id;
  }

  return sortOrderA - sortOrderB;
}

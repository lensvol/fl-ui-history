import { createSelector } from "reselect";
import { IAppState } from "types/app";
import { IOutfit } from "types/outfit";

function getOutfits(state: IAppState) {
  return state.myself.character.outfits;
}

function findSelectedOutfit(outfits: IOutfit[]) {
  return outfits.find((outfit) => outfit.selected);
}

export default createSelector([getOutfits], findSelectedOutfit);

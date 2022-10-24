import { ChangeOutfitRequestedAction } from "actions/outfit/changeOutfit";
import { IMyselfState } from "types/myself";
import { IOutfit } from "types/outfit";

/**
 * Optimistically update current selected outfit to the new selected outfit chosen by the player, while
 * we wait for the network call to resolve.
 * @param state
 * @param action
 */
export default function changeOutfitRequested(
  state: IMyselfState,
  action: ChangeOutfitRequestedAction
): IMyselfState {
  const { outfits } = state.character;
  const newSelectedOutfitId = action.payload;

  const index = outfits.findIndex((o) => o.id === newSelectedOutfitId);
  if (index < 0) {
    return state;
  }

  const updatedOutfits = state.character.outfits.reduce(
    (acc: IOutfit[], next: IOutfit) => [
      ...acc,
      { ...next, selected: next.id === newSelectedOutfitId },
    ],
    []
  );

  return {
    ...state,
    character: {
      ...state.character,
      outfits: updatedOutfits,
    },
  };
}

import { IMyselfState } from "types/myself";

export default function renameOutfitSuccess(
  state: IMyselfState,
  payload: { id: number; name: string }
) {
  const {
    character: { outfits },
  } = state;
  const matchIndex = outfits.findIndex((o) => o.id === payload.id);

  if (matchIndex < 0) {
    return state;
  }

  return {
    ...state,
    character: {
      ...state.character,
      outfits: [
        ...state.character.outfits.slice(0, matchIndex),
        { ...state.character.outfits[matchIndex], name: payload.name },
        ...state.character.outfits.slice(matchIndex + 1),
      ],
    },
  };
}

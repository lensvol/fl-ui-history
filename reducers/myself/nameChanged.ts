import { IMyselfState } from "types/myself";

export default function nameChanged(state: IMyselfState, payload: string) {
  return {
    ...state,
    character: {
      ...state.character,
      name: payload,
    },
  };
}

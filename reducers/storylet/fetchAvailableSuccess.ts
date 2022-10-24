import { IStoryletState } from "types/storylet";

export default function fetchAvailableSuccess(
  state: IStoryletState,
  payload: any
): IStoryletState {
  return {
    ...state,
    canChangeOutfit: payload.canChangeOutfit,
    endStorylet: payload.endStorylet,
    isFetching: false,
    storylets: payload.storylets,
    phase: payload.phase,
    storylet: payload.storylet,
    messages: payload.messages,
    // rootEventId: payload.id,
  };
}

import { SPRITE_LOADER_PROGRESS } from "actiontypes/spriteLoader";

export interface ISpriteLoaderState {
  progress: number;
}

const INITIAL_STATE: ISpriteLoaderState = {
  progress: 0,
};

export default function reducer(
  state = INITIAL_STATE,
  action: { type: string; payload: any }
) {
  switch (action.type) {
    case SPRITE_LOADER_PROGRESS:
      return { progress: action.payload as number };
    default:
      return state;
  }
}

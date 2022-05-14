import { Dispatch } from 'redux';
import { SPRITE_LOADER_PROGRESS } from 'actiontypes/spriteLoader';

export type SpriteLoaderProgress = {
  type: typeof SPRITE_LOADER_PROGRESS,
  payload: number,
};

export function spriteLoaderProgress(progress: number) {
  return (dispatch: Dispatch) => dispatch({ type: SPRITE_LOADER_PROGRESS, payload: progress });
}

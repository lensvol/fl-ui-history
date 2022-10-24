import { handleVersionMismatch } from "actions/versionSync";
import {
  DRAW_CARDS_FAILURE,
  DRAW_CARDS_REQUESTED,
  DRAW_CARDS_SUCCESS,
} from "actiontypes/cards";
import { ActionCreator } from "redux";
import { Either, Failure, Success } from "services/BaseMonadicService";
import { VersionMismatch } from "services/BaseService";
import CardsService, {
  DrawCardsResponse,
  FetchCardsResponse,
  ICardsService,
} from "services/CardsService";
import {
  putIn,
  fetchAvailable as fetchAvailableStorylets,
} from "actions/storylet";
import { setNextAvailable } from "actions/timer";
import computeNextActionsAt from "utils/computeNextActionsAt";
import { IAppState } from "types/app";

export type DrawCardsRequested = { type: typeof DRAW_CARDS_REQUESTED };
export type DrawCardsSuccess = {
  type: typeof DRAW_CARDS_SUCCESS;
  payload: FetchCardsResponse;
};
export type DrawCardsFailure = { type: typeof DRAW_CARDS_FAILURE };

export type DrawCardsActions =
  | DrawCardsRequested
  | DrawCardsFailure
  | DrawCardsSuccess;

const drawRequest: ActionCreator<DrawCardsRequested> = () => ({
  type: DRAW_CARDS_REQUESTED,
});

const drawSuccess: ActionCreator<DrawCardsSuccess> = (
  data: FetchCardsResponse
) => ({
  type: DRAW_CARDS_SUCCESS,
  payload: data,
});

const drawFailure: ActionCreator<DrawCardsFailure> = (error: any) => ({
  type: DRAW_CARDS_FAILURE,
  error: true,
  status: error.response && error.response.status,
});

/** ----------------------------------------------------------------------------
 * DRAW
 -----------------------------------------------------------------------------*/
export default draw(new CardsService());

export function draw(
  service: ICardsService
): () => (
  dispatch: Function,
  getState: () => IAppState
) => Promise<Either<DrawCardsResponse> | VersionMismatch> {
  return () => async (dispatch: Function, getState: () => IAppState) => {
    // Check whether we're in the middle of a destructive edit on the player
    // state and, if so, return with a failure message
    const {
      cards: { isDrawing, isFetching, isPlaying },
    } = getState();

    if (isDrawing || isFetching || isPlaying) {
      return new Failure("In the middle of doing something else");
    }

    dispatch(drawRequest());

    try {
      const result = await service.drawOpportunityCards();

      if (result instanceof Success) {
        const { data } = result;
        if (data.isInAStorylet) {
          dispatch(putIn());
          dispatch(fetchAvailableStorylets());
        }
        dispatch(drawSuccess(data));

        // Update timer with incoming data
        const { nextActionAt, currentTime } = data;

        dispatch(
          setNextAvailable(computeNextActionsAt({ nextActionAt, currentTime }))
        );
      }

      return result;
    } catch (error) {
      if (error instanceof VersionMismatch) {
        dispatch(handleVersionMismatch(error));
        return error;
      }
      dispatch(drawFailure(error));
      throw error;
    }
  };
}

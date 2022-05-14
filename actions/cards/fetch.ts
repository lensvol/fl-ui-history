/* eslint-disable func-names */
import { PutInAction } from 'actions/storylet/putIn';
import { handleVersionMismatch } from 'actions/versionSync';
import { ActionCreator } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import {
  Either,
  Failure,
} from 'services/BaseMonadicService';
import { VersionMismatch } from 'services/BaseService';
import CardService, {
  FetchCardsResponse,
  ICardsService,
} from 'services/CardsService';
import {
  setNextAvailable,
  TimerAction,
} from 'actions/timer';
import { putIn } from 'actions/storylet';
import computeNextActionsAt from 'utils/computeNextActionsAt';
import {
  BACKGROUND_FETCH_CARDS_REQUESTED,
  CARDS_SHOULD_FETCH,
  FETCH_CARDS_FAILURE,
  FETCH_CARDS_REQUESTED,
  FETCH_CARDS_SUCCESS,
} from 'actiontypes/cards';
import { IAppState } from 'types/app';

export type FetchCardsRequested = { type: typeof BACKGROUND_FETCH_CARDS_REQUESTED | typeof FETCH_CARDS_REQUESTED };
export type FetchCardsSuccess = { type: typeof FETCH_CARDS_SUCCESS, payload: FetchCardsResponse };
export type FetchCardsFailure = { type: typeof FETCH_CARDS_FAILURE };

export type ShouldFetchCards = { type: typeof CARDS_SHOULD_FETCH };

export type FetchCardsActions = FetchCardsRequested | FetchCardsSuccess | FetchCardsFailure | ShouldFetchCards;

const fetchRequested: ActionCreator<FetchCardsRequested> = (background: boolean) => ({
  type: background ? BACKGROUND_FETCH_CARDS_REQUESTED : FETCH_CARDS_REQUESTED,
});

export const fetchSuccess: ActionCreator<FetchCardsSuccess> = (data: FetchCardsResponse) => ({
  type: FETCH_CARDS_SUCCESS,
  payload: data,
});

export const shouldFetch: ActionCreator<ShouldFetchCards> = () => ({ type: CARDS_SHOULD_FETCH });

const fetchFailure: ActionCreator<FetchCardsFailure> = () => ({
  type: FETCH_CARDS_FAILURE,
});

export default fetch(new CardService());

type FetchOptions = {
  background?: boolean,
  preventMove?: boolean,
};

/** ----------------------------------------------------------------------------
 * FETCH CARDS
 * preventMove bool - HS parameter to stop the loading of opp cards moving player out of
 * storylet end. Bit of a hack. Sorry.
 -----------------------------------------------------------------------------*/

type FetchActions = FetchCardsActions | PutInAction | TimerAction;

export function fetch(service: ICardsService): (options?: FetchOptions) => (
  dispatch: ThunkDispatch<Either<FetchCardsResponse>, IAppState, FetchActions>,
  getState: () => IAppState,
) => Promise<Either<FetchCardsResponse> | VersionMismatch> {
  return function (options: FetchOptions = {}) {
    const { background = false, preventMove = false } = options;

    return async function (
      dispatch: ThunkDispatch<Promise<Either<FetchCardsResponse>>, IAppState, FetchActions>,
      getState: () => IAppState,
    ) {
      const { cards: { isFetching, isFetchingInBackground } } = getState();

      if (isFetching || isFetchingInBackground) {
        return new Failure('Already fetching cards');
      }

      dispatch(fetchRequested(background));

      try {
        const result = await service.fetchOpportunityCards();

        if (result instanceof Failure) {
          dispatch(fetchFailure());
          return result;
        }

        const { data } = result;
        const {
          currentTime,
          isInAStorylet,
          nextActionAt,
        } = data;
        if (!preventMove && isInAStorylet && !background) {
          dispatch(putIn());
        }
        const nextActionsAt = computeNextActionsAt({ currentTime, nextActionAt });
        dispatch(setNextAvailable(nextActionsAt));
        dispatch(fetchSuccess(data));

        return result;
      } catch (error) {
        if (error instanceof VersionMismatch) {
          dispatch(handleVersionMismatch(error));
          return error;
        }

        dispatch(fetchFailure());
        throw error;
      }
    };
  };
}
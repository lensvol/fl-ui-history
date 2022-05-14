import { handleVersionMismatch } from 'actions/versionSync';
import {
  DISCARD_CARDS_FAILURE,
  DISCARD_CARDS_REQUESTED,
  DISCARD_CARDS_SUCCESS,
} from 'actiontypes/cards';
import { ActionCreator } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import {
  Either,
  Success,
} from 'services/BaseMonadicService';
import { VersionMismatch } from 'services/BaseService';
import CardService, {
  DiscardCardResponse,
  ICardsService,
} from 'services/CardsService';

export type DiscardCardsRequested = { type: typeof DISCARD_CARDS_REQUESTED };
export type DiscardCardsSuccess = {
  type: typeof DISCARD_CARDS_SUCCESS,
  payload: DiscardCardResponse,
}
export type DiscardCardsFailure = { type: typeof DISCARD_CARDS_FAILURE };

export type DiscardCardsAction = DiscardCardsRequested | DiscardCardsFailure | DiscardCardsSuccess;

export const discardRequest: ActionCreator<DiscardCardsRequested> = () => ({
  type: DISCARD_CARDS_REQUESTED,
});

export const discardSuccess: ActionCreator<DiscardCardsSuccess> = (data: DiscardCardResponse) => ({
  type: DISCARD_CARDS_SUCCESS,
  payload: data,
});

export const discardFailure: ActionCreator<DiscardCardsFailure> = (error: any) => ({
  type: DISCARD_CARDS_FAILURE,
  error: true,
  status: error.response && error.response.status,
});

export default discard(new CardService());

export function discard(service: ICardsService): (eventId: number)
  => (dispatch: ThunkDispatch<Promise<Either<DiscardCardResponse>>, any, any>)
  => Promise<Either<DiscardCardResponse> | VersionMismatch> {
  return (eventId: number) => async (dispatch: ThunkDispatch<Either<DiscardCardResponse>, any, any>) => {
    dispatch(discardRequest());

    try {
      const result = await service.discardOpportunityCard(eventId);
      if (result instanceof Success) {
        dispatch<DiscardCardsSuccess>(discardSuccess(result.data));
      } else {
        dispatch<DiscardCardsFailure>(discardFailure(result));
      }
      return result;
    } catch (error) {
      if (error instanceof VersionMismatch) {
        dispatch(handleVersionMismatch(error));
        return error;
      }
      dispatch(discardFailure(error));
      throw error;
    }
  };
}

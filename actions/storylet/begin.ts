import { handleVersionMismatch } from 'actions/versionSync';
import {
  CHOOSE_STORYLET_FAILURE,
  CHOOSE_STORYLET_REQUESTED,
  CHOOSE_STORYLET_SUCCESS,
} from 'actiontypes/storylet';
import { ActionCreator } from 'redux';
import { VersionMismatch } from 'services/BaseService';
import StoryletService, {
  IApiStoryletResponseData,
  IStoryletService,
} from 'services/StoryletService';

import { hideMap } from 'actions/map';
import { processMessages } from 'actions/app';
import { IAppState } from 'types/app';

export type BeginFailureAction = {
  type: typeof CHOOSE_STORYLET_FAILURE,
  error: boolean,
  status?: number,
};

export type BeginRequestedAction = {
  type: typeof CHOOSE_STORYLET_REQUESTED,
};

export type BeginSuccessAction = {
  type: typeof CHOOSE_STORYLET_SUCCESS,
  payload: Pick<IApiStoryletResponseData,
    'actions' | 'canChangeOutfit' | 'phase' | 'storylets' | 'storylet' | 'endStorylet' | 'messages'>,
};

export type BeginStoryletActions = BeginSuccessAction | BeginRequestedAction | BeginFailureAction;

const beginRequest: ActionCreator<BeginRequestedAction> = (_eventId: number) => ({
  type: CHOOSE_STORYLET_REQUESTED,
});

const beginSuccess: ActionCreator<BeginSuccessAction> = (data: IApiStoryletResponseData) => ({
  type: CHOOSE_STORYLET_SUCCESS,
  payload: {
    actions: data.actions,
    canChangeOutfit: data.canChangeOutfit,
    phase: data.phase,
    storylets: data.storylets,
    storylet: data.storylet,
    endStorylet: data.endStorylet,
    messages: data.messages,
  },
});

const beginFailure: ActionCreator<BeginFailureAction> = (error: any) => ({
  type: CHOOSE_STORYLET_FAILURE,
  error: true,
  status: error.response && error.response.status,
});

const service: IStoryletService = new StoryletService();

/** ----------------------------------------------------------------------------
 * BEGIN
 -----------------------------------------------------------------------------*/
export default function begin(eventId: number) {
  return async (dispatch: Function, getState: () => IAppState) => { // eslint-disable-line
    // If we are already choosing a storylet, don't send another request
    const { storylet: { isChoosing } } = getState();
    if (isChoosing) {
      return {};
    }

    dispatch(beginRequest(eventId));

    try {
      const { data } = await service.begin(eventId);
      dispatch(beginSuccess(data));

      // Close the map
      dispatch(hideMap());

      // If we have some messages to process (e.g. we have been Must-ed into a new area)
      // process them now.
      if (data.messages) {
        dispatch(processMessages(data.messages));
      }

      return data;
    } catch (error) {
      if (error instanceof VersionMismatch) {
        dispatch(handleVersionMismatch(error));
      }
      dispatch(beginFailure(error));
      return error;
    }
  };
}
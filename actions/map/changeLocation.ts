import { handleVersionMismatch } from 'actions/versionSync';
import * as StoryletActionCreators from 'actions/storylet';
import { fetch as fetchCards } from 'actions/cards';
import {
  CHANGE_LOCATION_FAILURE,
  CHANGE_LOCATION_REQUESTED,
  CHANGE_LOCATION_SUCCESS,
} from 'actiontypes/map';
import { ActionCreator } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { Success } from 'services/BaseMonadicService';
import { VersionMismatch } from 'services/BaseService';
import MapService, { IMapService } from 'services/MapService';
import { IAppState } from 'types/app';
import hideMap from './hideMap';
import setCurrentArea from './setCurrentArea';

export type ChangeLocationFailure = {
  type: typeof CHANGE_LOCATION_FAILURE,
  status: number | undefined,
};

export type ChangeLocationRequested = { type: typeof CHANGE_LOCATION_REQUESTED };

export type ChangeLocationSuccess = {
  type: typeof CHANGE_LOCATION_SUCCESS,
  payload: { message: string },
}

export type ChangeLocationAction = ChangeLocationFailure | ChangeLocationRequested | ChangeLocationSuccess;

const changeLocationRequested: ActionCreator<ChangeLocationRequested> = () => ({
  type: CHANGE_LOCATION_REQUESTED,
});

const changeLocationSuccess: ActionCreator<ChangeLocationSuccess> = ({ message }: { message: string }) => ({
  type: CHANGE_LOCATION_SUCCESS,
  payload: { message },
});

const changeLocationFailure: ActionCreator<ChangeLocationFailure> = (error: any) => ({
  type: CHANGE_LOCATION_FAILURE,
  status: error?.response?.status,
});

/** ----------------------------------------------------------------------------
 * CHANGE LOCATION
 -----------------------------------------------------------------------------*/
export default changeLocation(new MapService());

export function changeLocation(service: IMapService) {
  const defaultOptions = {
    closeMap: true,
  };

  return (areaId: number, options?: { closeMap: boolean }) => async (
    dispatch: ThunkDispatch<any, any, any>,
    getState: () => IAppState,
  ) => {
    const { closeMap } = { ...defaultOptions, ...options };
    // Get the value of `showOps` before changing location
    const { map: { showOps: showOpsBeforeMove } } = getState();
    dispatch(changeLocationRequested());
    try {
      const result = await service.changeLocation(areaId);
      if (result instanceof Success) {
        const { data } = result;
        dispatch(changeLocationSuccess(data));
        dispatch(setCurrentArea(data.area));
        dispatch(StoryletActionCreators.fetchAvailable());
        if (closeMap) {
          dispatch(hideMap());
        }

        // Get the value of `showOps` after changing location
        const { map: { showOps: showOpsAfterMove } } = getState();
        // If we weren't showing opp cards before moving, but we are now,
        // then fetch them
        if (!showOpsBeforeMove && showOpsAfterMove) {
          dispatch(fetchCards());
        }
      }
      return result;
    } catch (error) {
      if (error instanceof VersionMismatch) {
        dispatch(handleVersionMismatch(error));
        return error;
      }
      console.error(error);
      dispatch(changeLocationFailure(error));
      throw error;
    }
  };
}

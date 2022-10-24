/* eslint-disable react-hooks/rules-of-hooks */

import { handleVersionMismatch } from "actions/versionSync";
import { ActionCreator } from "redux";
import { VersionMismatch } from "services/BaseService";
import {
  CANNOT_USE_QUALITY,
  USE_QUALITY_FAILURE,
  USE_QUALITY_REQUESTED,
  USE_QUALITY_SUCCESS,
} from "actiontypes/storylet";
import * as StoryletActionTypes from "actiontypes/storylet";
import StoryletService from "services/StoryletService";

import fetchAvailable from "actions/storylet/fetchAvailable";

const service = new StoryletService();

export type UseQualityRequestedAction = { type: typeof USE_QUALITY_REQUESTED };
export type UseQualitySuccessAction = { type: typeof USE_QUALITY_SUCCESS };
export type UseQualityFailureAction = { type: typeof USE_QUALITY_FAILURE };

export type CannotUseQualityAction = {
  type: typeof CANNOT_USE_QUALITY;
  payload: {
    cannotUseMessage: string;
  };
};

export type UseQualityAction =
  | UseQualityRequestedAction
  | UseQualitySuccessAction
  | UseQualityFailureAction
  | CannotUseQualityAction;

/** ----------------------------------------------------------------------------
 * USE QUALITY
 -----------------------------------------------------------------------------*/
export default function useQuality(id: number, history: any) {
  return (dispatch: Function) => {
    dispatch(useQualityRequested());
    service
      .useQuality(id)
      .then((response: { data: any }) => {
        if (response.data.isSuccess) {
          dispatch(useQualitySuccess());
          dispatch(fetchAvailable());
          history.push("/");
        } else {
          dispatch(cannotUseQuality(response.data));
        }
      })
      .catch((error) => {
        console.error(error);
        if (error instanceof VersionMismatch) {
          dispatch(handleVersionMismatch(error));
        }
        dispatch(useQualityFailure(error));
      });
  };
}

const useQualityRequested: ActionCreator<UseQualityRequestedAction> = () => ({
  type: StoryletActionTypes.USE_QUALITY_REQUESTED,
  isFetching: true,
});

const useQualitySuccess: ActionCreator<UseQualitySuccessAction> = () => ({
  type: StoryletActionTypes.USE_QUALITY_SUCCESS,
  isFetching: false,
});

const useQualityFailure: ActionCreator<UseQualityFailureAction> = (
  error: any
) => ({
  type: StoryletActionTypes.USE_QUALITY_FAILURE,
  isFetching: false,
  error: true,
  status: error.response && error.response.status,
});

const cannotUseQuality: ActionCreator<CannotUseQualityAction> = (data: {
  message: string;
}) => ({
  type: StoryletActionTypes.CANNOT_USE_QUALITY,
  payload: {
    cannotUseMessage: data.message,
  },
});

import { ChooseNewDisplayQualitySuccess } from 'actions/myself/chooseNewDisplayQualitySuccess';
import { handleVersionMismatch } from 'actions/versionSync';

import {
  CHOOSE_NEW_MANTELPIECE_FAILURE,
  CHOOSE_NEW_MANTELPIECE_REQUESTED,
  CHOOSE_NEW_MANTELPIECE_SUCCESS,
} from 'actiontypes/myself';
import { ActionCreator } from 'redux';
import { Success } from 'services/BaseMonadicService';
import { VersionMismatch } from 'services/BaseService';
import MyselfService from 'services/MyselfService';
import { IQuality } from 'types/qualities';

export type ChooseNewMantelpieceRequested = { type: typeof CHOOSE_NEW_MANTELPIECE_REQUESTED };
export type ChooseNewMantelpieceSuccess = ChooseNewDisplayQualitySuccess<typeof CHOOSE_NEW_MANTELPIECE_SUCCESS>;

export type ChooseNewMantelpieceFailure = { type: typeof CHOOSE_NEW_MANTELPIECE_FAILURE };

export type ChooseNewMantelpieceActions
  = ChooseNewMantelpieceRequested
  | ChooseNewMantelpieceSuccess
  | ChooseNewMantelpieceFailure;

const chooseNewMantelpieceRequested: ActionCreator<ChooseNewMantelpieceRequested> = () => ({
  type: CHOOSE_NEW_MANTELPIECE_REQUESTED,
});

const chooseNewMantelpieceSuccess: ActionCreator<ChooseNewMantelpieceSuccess> = (data: IQuality) => ({
  type: CHOOSE_NEW_MANTELPIECE_SUCCESS,
  payload: data,
});

const service = new MyselfService();

export default function chooseNewMantelpiece(item: IQuality) {
  return async (dispatch: Function) => {
    dispatch(chooseNewMantelpieceRequested());

    try {
      const result = await service.chooseNewMantelpiece(item);
      if (result instanceof Success) {
        const { data } = result;
        dispatch(chooseNewMantelpieceSuccess(data.data));
      }
    } catch (error) {
      if (error instanceof VersionMismatch) {
        dispatch(handleVersionMismatch(error));
        return error;
      }
      throw error;
    }
  };
}

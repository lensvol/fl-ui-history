import { handleVersionMismatch } from 'actions/versionSync';
import * as SettingsActionTypes from 'actiontypes/settings';
import { ActionCreator } from 'redux';
import {
  Either,
  Success,
} from 'services/BaseMonadicService';
import { VersionMismatch } from 'services/BaseService';
import SettingsService, {
  MessagesViaResponse,
  MessageVia,
} from 'services/SettingsService';

const service = new SettingsService();

export type SaveMessageViaRequested = { type: typeof SettingsActionTypes.SAVE_MESSAGES_VIA_REQUESTED };
export type SaveMessageViaFailure = { type: typeof SettingsActionTypes.SAVE_MESSAGES_VIA_FAILURE };
export type SaveMessageViaSuccess = { type: typeof SettingsActionTypes.SAVE_MESSAGES_VIA_SUCCESS };

export type SaveMessageViaActions =
  SaveMessageViaFailure
  | SaveMessageViaRequested
  | SaveMessageViaSuccess;

export const saveMessageViaRequested = () => ({
  type: SettingsActionTypes.SAVE_MESSAGES_VIA_REQUESTED,
});

export const saveMessageViaSuccess: ActionCreator<SaveMessageViaSuccess> = (_response: MessagesViaResponse) => ({
  type: SettingsActionTypes.SAVE_MESSAGES_VIA_SUCCESS,
});

export const saveMessageViaFailure = (_error?: any) => ({
  type: SettingsActionTypes.SAVE_MESSAGES_VIA_FAILURE,
});

export default function saveMessageVia(type: MessageVia) {
  return async (dispatch: Function) => {
    dispatch(saveMessageViaRequested());

    try {
      const result: Either<MessagesViaResponse> = await service.messagesVia(type);
      if (result instanceof Success) {
        dispatch(saveMessageViaSuccess(result.data));
      } else {
        dispatch(saveMessageViaFailure());
      }
      return result;
    } catch (error) {
      if (error instanceof VersionMismatch) {
        dispatch(handleVersionMismatch(error));
        return error;
      }
      dispatch(saveMessageViaFailure(error));
      throw error;
    }
  };
}
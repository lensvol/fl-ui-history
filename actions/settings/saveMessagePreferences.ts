import { handleVersionMismatch } from 'actions/versionSync';
import * as SettingsActionTypes from 'actiontypes/settings';
import { Success } from 'services/BaseMonadicService';
import { VersionMismatch } from 'services/BaseService';
import SettingsService, {
  ISettingsService,
  SaveMessagePreferencesResponse,
} from 'services/SettingsService';
import { MessagePreferences } from 'reducers/settings';

export type SaveMessagePreferencesRequested = { type: typeof SettingsActionTypes.SAVE_MESSAGE_PREFERENCES_REQUESTED };
export type SaveMessagePreferencesFailure = { type: typeof SettingsActionTypes.SAVE_MESSAGE_PREFERENCES_FAILURE };
export type SaveMessagePreferencesSuccess = {
  type: typeof SettingsActionTypes.SAVE_MESSAGE_PREFERENCES_SUCCESS,
  payload: SaveMessagePreferencesResponse,
};

export type SaveMessagePreferencesActions
  = SaveMessagePreferencesFailure
  | SaveMessagePreferencesRequested
  | SaveMessagePreferencesSuccess;

export const saveMessagePreferencesRequested = () => ({
  type: SettingsActionTypes.SAVE_MESSAGE_PREFERENCES_REQUESTED,
});

export const saveMessagePreferencesSuccess = (response: SaveMessagePreferencesResponse) => ({
  type: SettingsActionTypes.SAVE_MESSAGE_PREFERENCES_SUCCESS,
  payload: response,
});

export const saveMessagePreferencesFailure = (_error?: any) => ({
  type: SettingsActionTypes.SAVE_MESSAGE_PREFERENCES_FAILURE,
});

export default saveMessagePreferences(new SettingsService());

export function saveMessagePreferences(service: ISettingsService) {
  return (messagePreferences: MessagePreferences) => async (dispatch: Function) => {
    dispatch(saveMessagePreferencesRequested());
    try {
      const result = await service.saveMessagePreferences(messagePreferences);
      if (result instanceof Success) {
        dispatch(saveMessagePreferencesSuccess(result.data));
      } else {
        dispatch(saveMessagePreferencesFailure());
      }
      return result;
    } catch (e) {
      if (e instanceof VersionMismatch) {
        dispatch(handleVersionMismatch(e));
      }
    }
  };
}

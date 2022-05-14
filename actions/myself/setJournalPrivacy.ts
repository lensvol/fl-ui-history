import { handleVersionMismatch } from 'actions/versionSync';
import {
  SET_JOURNAL_PRIVACY_REQUESTED,
  SET_JOURNAL_PRIVACY_SUCCESS,
} from 'actiontypes/myself';
import { ActionCreator } from 'redux';
import { Success } from 'services/BaseMonadicService';
import { VersionMismatch } from 'services/BaseService';
import MyselfService, { IMyselfService } from 'services/MyselfService';

export type SetJournalPrivacyRequested = {
  type: typeof SET_JOURNAL_PRIVACY_REQUESTED,
  payload: { journalIsPrivate: boolean },
};

export type SetJournalPrivacySuccess = {
  type: typeof SET_JOURNAL_PRIVACY_SUCCESS,
  payload: { journalIsPrivate: boolean },
};

export type SetJournalPrivacyActions = SetJournalPrivacyRequested | SetJournalPrivacySuccess;

export default setJournalPrivacy(new MyselfService());

export function setJournalPrivacy(service: IMyselfService) {
  return (isPrivate: boolean) => async (dispatch: Function) => {
    dispatch(setJournalPrivacyRequested(isPrivate));

    try {
      const result = await service.setJournalPrivacy(isPrivate);
      if (result instanceof Success) {
        const { data } = result;
        dispatch(setJournalPrivacySuccess(data));
      }
      return result;
    } catch (error) {
      if (error instanceof VersionMismatch) {
        dispatch(handleVersionMismatch(error));
      }
      throw error;
    }
  };
}

const setJournalPrivacyRequested: ActionCreator<SetJournalPrivacyRequested> = (journalIsPrivate: boolean) => ({
  type: SET_JOURNAL_PRIVACY_REQUESTED,
  payload: { journalIsPrivate },
});

const setJournalPrivacySuccess: ActionCreator<SetJournalPrivacySuccess> = ({ journalIsPrivate }: { journalIsPrivate: boolean }) => ({
  type: SET_JOURNAL_PRIVACY_SUCCESS,
  payload: { journalIsPrivate },
});

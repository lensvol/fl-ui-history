import { handleVersionMismatch } from 'actions/versionSync';

import {
  CHOOSE_NEW_SCRAPBOOK_FAILURE,
  CHOOSE_NEW_SCRAPBOOK_REQUESTED,
  CHOOSE_NEW_SCRAPBOOK_SUCCESS,
} from 'actiontypes/myself';
import { Success } from 'services/BaseMonadicService';
import { VersionMismatch } from 'services/BaseService';
import MyselfService from 'services/MyselfService';
import { IQuality } from 'types/qualities';

export type ChooseNewScrapbookRequested = { type: typeof CHOOSE_NEW_SCRAPBOOK_REQUESTED };
export type ChooseNewScrapbookSuccess = {
  type: typeof CHOOSE_NEW_SCRAPBOOK_SUCCESS,
  payload: IQuality,
};
export type ChooseNewScrapbookFailure = { type: typeof CHOOSE_NEW_SCRAPBOOK_FAILURE };

export type ChooseNewScrapbookActions
  = ChooseNewScrapbookRequested
  | ChooseNewScrapbookSuccess
  | ChooseNewScrapbookFailure;

const chooseNewScrapbookRequested = () => ({
  type: CHOOSE_NEW_SCRAPBOOK_REQUESTED,
  isSuccess: false,
});

const chooseNewScrapbookSuccess = (data: IQuality) => ({
  type: CHOOSE_NEW_SCRAPBOOK_SUCCESS,
  isSuccess: true,
  payload: data,
});

/** ----------------------------------------------------------------------------
 * Choose new Scrapbook
 -----------------------------------------------------------------------------*/

const service = new MyselfService();

export default function chooseNewScrapbook(item: IQuality) {
  return async (dispatch: Function) => {
    dispatch(chooseNewScrapbookRequested());

    try {
      const result = await service.chooseNewScrapbook(item);
      if (result instanceof Success) {
        const { data } = result;
        dispatch(chooseNewScrapbookSuccess(data.data));
      }
    } catch (error) {
      if (error instanceof VersionMismatch) {
        dispatch(handleVersionMismatch(error));
      }
      throw error;
    }
  };
}
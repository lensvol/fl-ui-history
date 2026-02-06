import { handleVersionMismatch } from "actions/versionSync";

import {
  FETCH_PATCH_NOTE_NAVIGATION_FAILURE,
  FETCH_PATCH_NOTE_NAVIGATION_REQUESTED,
  FETCH_PATCH_NOTE_NAVIGATION_SUCCESS,
} from "actiontypes/news";

import { Success } from "services/BaseMonadicService";
import { VersionMismatch } from "services/BaseService";
import NewsService, { INewsService } from "services/NewsService";

const fetchRequested = () => ({
  type: FETCH_PATCH_NOTE_NAVIGATION_REQUESTED,
});

const fetchSuccess = (data: number[]) => ({
  type: FETCH_PATCH_NOTE_NAVIGATION_SUCCESS,
  payload: data,
});

const fetchFailure = (error?: any) => ({
  type: FETCH_PATCH_NOTE_NAVIGATION_FAILURE,
  error: true,
  status: error?.response?.status,
});

/** ----------------------------------------------------------------------------
 * FETCH NEWS ITEM
 -----------------------------------------------------------------------------*/
export const fetchPatchNoteNavigation = () => async (dispatch: Function) => {
  const newsService: INewsService = new NewsService();

  dispatch(fetchRequested());

  try {
    const result = await newsService.fetchPatchNoteNavigation();

    if (result instanceof Success) {
      dispatch(fetchSuccess(result.data));
    }

    return result;
  } catch (error) {
    if (error instanceof VersionMismatch) {
      dispatch(handleVersionMismatch(error));

      return error;
    }

    dispatch(fetchFailure(error));

    throw error;
  }
};

import { handleVersionMismatch } from "actions/versionSync";

import {
  FETCH_ALL_NEWS_FAILURE,
  FETCH_ALL_NEWS_REQUESTED,
  FETCH_ALL_NEWS_SUCCESS,
} from "actiontypes/news";

import { Success } from "services/BaseMonadicService";
import { VersionMismatch } from "services/BaseService";
import NewsService, { INewsService, NewsResponse } from "services/NewsService";

type FetchAllNewsFailure = {
  type: typeof FETCH_ALL_NEWS_FAILURE;
};

type FetchAllNewsRequested = {
  type: typeof FETCH_ALL_NEWS_REQUESTED;
};

type FetchAllNewsSuccess = {
  type: typeof FETCH_ALL_NEWS_SUCCESS;
  payload: NewsResponse[];
};

export type AllNewsActions =
  FetchAllNewsFailure | FetchAllNewsRequested | FetchAllNewsSuccess;

const fetchAllRequested = () => ({
  type: FETCH_ALL_NEWS_REQUESTED,
});

const fetchAllSuccess = (data: NewsResponse[]) => ({
  type: FETCH_ALL_NEWS_SUCCESS,
  payload: data,
});

const fetchAllFailure = (error?: any) => ({
  type: FETCH_ALL_NEWS_FAILURE,
  error: true,
  status: error?.response?.status,
});

/** ----------------------------------------------------------------------------
 * FETCH NEWS ITEM
 -----------------------------------------------------------------------------*/
export const fetchAllNews = () => async (dispatch: Function) => {
  const newsService: INewsService = new NewsService();

  dispatch(fetchAllRequested());

  try {
    const result = await newsService.fetchAll();

    if (result instanceof Success) {
      dispatch(fetchAllSuccess(result.data));
    }

    return result;
  } catch (error) {
    if (error instanceof VersionMismatch) {
      dispatch(handleVersionMismatch(error));

      return error;
    }

    dispatch(fetchAllFailure(error));

    throw error;
  }
};

import store from "store";

import { AllNewsActions } from "actions/news/fetchAllNews";
import { handleVersionMismatch } from "actions/versionSync";

import {
  DISMISS_NEWS_ITEM,
  FETCH_NEWS_FAILURE,
  FETCH_NEWS_REQUESTED,
  FETCH_NEWS_SUCCESS,
} from "actiontypes/news";

import { Success } from "services/BaseMonadicService";
import { VersionMismatch } from "services/BaseService";
import NewsService, { INewsService, NewsResponse } from "services/NewsService";

type DismissNewsItem = {
  type: typeof DISMISS_NEWS_ITEM;
};

type FetchNewsFailure = {
  type: typeof FETCH_NEWS_FAILURE;
};

type FetchNewsRequested = {
  type: typeof FETCH_NEWS_REQUESTED;
};

export type FetchNewsSuccess = {
  type: typeof FETCH_NEWS_SUCCESS;
  payload: NewsResponse | undefined;
};

export type NewsActions =
  | AllNewsActions
  | DismissNewsItem
  | FetchNewsFailure
  | FetchNewsRequested
  | FetchNewsSuccess;

const fetchRequested = () => ({
  type: FETCH_NEWS_REQUESTED,
});

const fetchSuccess = (data: NewsResponse) => ({
  type: FETCH_NEWS_SUCCESS,
  payload: data,
});

const fetchFailure = (error?: any) => ({
  type: FETCH_NEWS_FAILURE,
  error: true,
  status: error?.response?.status,
});

/** ----------------------------------------------------------------------------
 * FETCH NEWS ITEM
 -----------------------------------------------------------------------------*/
export const fetchNews = () => async (dispatch: Function) => {
  const newsService: INewsService = new NewsService();

  dispatch(fetchRequested());

  try {
    const result = await newsService.fetch();

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

export const dismissNewsItem = (id: number) => {
  store.set("dismissed_news_item", id);

  return {
    type: DISMISS_NEWS_ITEM,
    active: false,
  };
};

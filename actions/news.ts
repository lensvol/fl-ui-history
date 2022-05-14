import { handleVersionMismatch } from 'actions/versionSync';
import {
  DISMISS_NEWS_ITEM,
  FETCH_NEWS_FAILURE,
  FETCH_NEWS_REQUESTED,
  FETCH_NEWS_SUCCESS,
} from 'actiontypes/news';
import { Success } from 'services/BaseMonadicService';
import { VersionMismatch } from 'services/BaseService';
import store from 'store';
import NewsService, { INewsService, NewsResponse } from 'services/NewsService';

export type FetchNewsRequested = { type: typeof FETCH_NEWS_REQUESTED };
export type FetchNewsSuccess = {
  type: typeof FETCH_NEWS_SUCCESS,
  payload: NewsResponse,
};
export type FetchNewsFailure = { type: typeof FETCH_NEWS_FAILURE };

export type DismissNewsItem = { type: typeof DISMISS_NEWS_ITEM };

export type NewsActions = FetchNewsRequested | FetchNewsFailure | FetchNewsSuccess | DismissNewsItem;


/** ----------------------------------------------------------------------------
 * FETCH NEWS ITEM
 -----------------------------------------------------------------------------*/
export const fetch = () => async (dispatch: Function) => {
  dispatch(fetchRequested());

  const newsService: INewsService = new NewsService();

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

export const fetchRequested = () => ({
  type: FETCH_NEWS_REQUESTED,
});

export const fetchSuccess = (data: NewsResponse) => ({
  type: FETCH_NEWS_SUCCESS,
  payload: data,
});

export const fetchFailure = (error?: any) => ({
  type: FETCH_NEWS_FAILURE,
  error: true,
  status: error?.response?.status,
});

export const dismissNewsItem = (id: number) => {
  store.set('dismissed_news_item', id);
  return {
    type: DISMISS_NEWS_ITEM,
    active: false,
  };
};

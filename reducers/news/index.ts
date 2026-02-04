import { NewsActions } from "actions/news/fetchNews";

import * as NewsActionTypes from "actiontypes/news";

import fetchNewsSuccess from "reducers/news/fetchNewsSuccess";

import { NewsResponse } from "services/NewsService";

export type INewsState = {
  active: boolean;
  allNewsItems: NewsResponse[];
  isFetching: boolean;
  newsItem: NewsResponse | null;
};

/**
 * Iniitial state
 * @type {Object}
 */
const INITIAL_STATE: INewsState = {
  active: false,
  allNewsItems: [],
  isFetching: false,
  newsItem: null,
};

/**
 * News Reducer
 * @param {Object} state
 * @param {[Object]} action
 */
export default function reducer(state = INITIAL_STATE, action: NewsActions) {
  switch (action.type) {
    case NewsActionTypes.FETCH_NEWS_REQUESTED:
      return {
        ...state,
        isFetching: true,
        newsItem: null,
      };

    case NewsActionTypes.FETCH_NEWS_FAILURE:
      return {
        ...state,
        isFetching: false,
        newsItem: null,
      };

    case NewsActionTypes.FETCH_NEWS_SUCCESS:
      return fetchNewsSuccess(state, action);

    case NewsActionTypes.DISMISS_NEWS_ITEM:
      return {
        ...state,
        active: false,
      };

    case NewsActionTypes.FETCH_ALL_NEWS_REQUESTED:
      return {
        ...state,
        allNewsItems: [],
        isFetching: true,
      };

    case NewsActionTypes.FETCH_ALL_NEWS_FAILURE:
      return {
        ...state,
        allNewsItems: [],
        isFetching: false,
      };

    case NewsActionTypes.FETCH_ALL_NEWS_SUCCESS:
      return {
        ...state,
        allNewsItems: action.payload,
        isFetching: false,
      };

    default:
      return state;
  }
}

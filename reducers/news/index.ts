import { NewsActions } from "actions/news";
import * as NewsActionTypes from "actiontypes/news";
import { NewsResponse } from "services/NewsService";

import fetchNewsSuccess from "./fetchNewsSuccess";

export type INewsState = {
  active: boolean;
  isFetching: boolean;
  newsItem: NewsResponse | null;
};

/**
 * Iniitial state
 * @type {Object}
 */
const INITIAL_STATE: INewsState = {
  isFetching: false,
  newsItem: null,
  active: false,
};

/**
 * News Reducer
 * @param {Object} state
 * @param {[Object]} action
 */
export default function reducer(state = INITIAL_STATE, action: NewsActions) {
  switch (action.type) {
    case NewsActionTypes.FETCH_NEWS_REQUESTED:
      return { ...state, isFetching: true, newsItem: null };
    case NewsActionTypes.FETCH_NEWS_FAILURE:
      return { ...state, isFetching: false, newsItem: null };

    case NewsActionTypes.FETCH_NEWS_SUCCESS:
      return fetchNewsSuccess(state, action);

    case NewsActionTypes.DISMISS_NEWS_ITEM:
      return { ...state, active: false };

    default:
      return state;
  }
}

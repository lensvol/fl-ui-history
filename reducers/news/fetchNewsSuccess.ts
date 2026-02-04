import store from "store";

import { FetchNewsSuccess } from "actions/news/fetchNews";

import { INewsState } from "reducers/news/index";

export default function fetchNewsSuccess(
  state: INewsState,
  action: FetchNewsSuccess
) {
  // If the state.active is false, then check to see if the incoming news item has
  // a different Id from the one held in cookie store
  const active = state.active
    ? state.active
    : store.get("dismissed_news_item") !== action.payload?.id;

  return {
    ...state,
    active,
    isFetching: false,
    newsItem: action.payload,
  };
}

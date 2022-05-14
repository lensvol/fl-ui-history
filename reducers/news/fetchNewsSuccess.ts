import { FetchNewsSuccess } from 'actions/news';
import { INewsState } from 'reducers/news/index';
import store from 'store';

export default function fetchNewsSuccess(state: INewsState, action: FetchNewsSuccess) {
  // If the state.active is false, then check to see if the incoming news item has
  // a different Id from the one held in cookie store
  const active = state.active ? state.active : store.get('dismissed_news_item') !== action.payload.id;

  return {
    ...state,
    active,
    newsItem: action.payload,
  };
}
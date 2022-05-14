import { InfoBarActions } from 'actions/infoBar';
import * as InfoBarActionTypes from 'actiontypes/infoBar';
import { Advert, Snippet } from 'services/InfoBarService';

export type IInfobarState = {
  advert: Advert | undefined,
  isFetching: boolean,
  error: boolean,
  snippets: Snippet[],
};

const INITIAL_STATE = {
  isFetching: false,
  error: false,
  snippets: [],
};

export default function reducer(state = INITIAL_STATE, action: InfoBarActions) {
  switch (action.type) {
    case InfoBarActionTypes.FETCH_SNIPPETS_SUCCESS:
      return {
        ...state,
        snippets: [...state.snippets, ...action.payload.snippets],
      };

    case InfoBarActionTypes.SUPPORTING_DATA_SUCCESS:
      return {
        ...state,
        advert: action.payload.advert,
        snippets: action.payload.snippets,
      };

    default:
      return state;
  }
};

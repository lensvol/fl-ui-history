import { InfoBarActions } from "actions/infoBar";

import {
  FETCH_SNIPPETS_SUCCESS,
  SUPPORTING_DATA_SUCCESS,
} from "actiontypes/infoBar";

import { Advert, Snippet } from "services/InfoBarService";

export type IInfobarState = {
  advert?: Advert;
  error: boolean;
  isFetching: boolean;
  isSocialAvailable: boolean;
  snippets: Snippet[];
};

const INITIAL_STATE = {
  advert: undefined,
  error: false,
  isFetching: false,
  isSocialAvailable: false,
  snippets: [],
};

export default function reducer(state = INITIAL_STATE, action: InfoBarActions) {
  switch (action.type) {
    case FETCH_SNIPPETS_SUCCESS:
      return {
        ...state,
        snippets: [...state.snippets, ...action.payload.snippets],
      };

    case SUPPORTING_DATA_SUCCESS:
      return {
        ...state,
        advert: action.payload.advert,
        isSocialAvailable: action.payload.isSocialAvailable,
        snippets: action.payload.snippets,
      };

    default:
      return state;
  }
}

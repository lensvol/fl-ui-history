import {
  MESSAGES_TAB,
  MYSELF_TAB,
  STORYLET_TAB,
} from 'actiontypes/subtabs';
import { AnyAction } from 'redux';
import { ISubtabsState } from 'types/subtabs';

const INITIAL_STATE: ISubtabsState = {
  storylet: 'always',
  myself: 'possessions',
  messages: 'interactions',
};

export default function reducer(state = INITIAL_STATE, action: AnyAction) {
  switch (action.type) {
    case MESSAGES_TAB:
      return { ...state, messages: action.payload };
    case MYSELF_TAB:
      return { ...state, myself: action.payload };
    case STORYLET_TAB:
      return { ...state, storylet: action.payload };
    default:
      return state;
  }
}
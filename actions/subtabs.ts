import {
  MESSAGES_TAB,
  MYSELF_TAB,
  STORYLET_TAB,
} from 'actiontypes/subtabs';
import { ThunkDispatch } from 'redux-thunk';

type Tab = 'myself' | 'storylet' | 'messages';

export type SetStoryletSubtab = { type: typeof STORYLET_TAB };
export type SetMessagesSubtab = { type: typeof MESSAGES_TAB };
export type SetMyselfSubtab = { type: typeof MYSELF_TAB };

export type TabAction = SetStoryletSubtab | SetMessagesSubtab | SetMyselfSubtab;

export function setTab({ tab, subtab }: { tab: Tab, subtab: string }) {
  return (dispatch: ThunkDispatch<any, any, any>): TabAction => {
    if (tab === 'storylet') {
      return dispatch({ type: STORYLET_TAB, payload: subtab });
    }
    if (tab === 'messages') {
      return dispatch({ type: MESSAGES_TAB, payload: subtab });
    }
    return dispatch({ type: MYSELF_TAB, payload: subtab });
  };
}
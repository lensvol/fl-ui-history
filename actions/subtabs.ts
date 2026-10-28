import { ThunkDispatch } from "redux-thunk";

import { MESSAGES_TAB, MYSELF_TAB, STORYLET_TAB } from "actiontypes/subtabs";

type TabName = "myself" | "storylet" | "messages";

export type SetMessagesSubtab = {
  type: typeof MESSAGES_TAB;
};

export type SetMyselfSubtab = {
  type: typeof MYSELF_TAB;
};

export type SetStoryletSubtab = {
  type: typeof STORYLET_TAB;
};

export type TabAction = SetMessagesSubtab | SetMyselfSubtab | SetStoryletSubtab;

type TabAndSubtab = {
  tab: TabName;
  subtab: string;
};

export function setTab({ tab, subtab }: TabAndSubtab) {
  return (dispatch: ThunkDispatch<any, any, any>): TabAction => {
    if (tab === "storylet") {
      return dispatch({
        type: STORYLET_TAB,
        payload: subtab,
      });
    }

    if (tab === "messages") {
      return dispatch({
        type: MESSAGES_TAB,
        payload: subtab,
      });
    }

    return dispatch({
      type: MYSELF_TAB,
      payload: subtab,
    });
  };
}

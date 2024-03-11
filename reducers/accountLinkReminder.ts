import { AccountLinkReminderActions } from "actions/accountLinkReminder";

import {
  HIDE_ACCOUNT_LINK_REMINDER,
  SHOW_ACCOUNT_LINK_REMINDER,
} from "actiontypes/accountLinkReminder";

export type IAccountLinkReminderState = {
  isModalOpen: boolean;
};

const INITIAL_STATE = {
  isModalOpen: false,
};

export default function reducer(
  state = INITIAL_STATE,
  action: AccountLinkReminderActions
) {
  switch (action.type) {
    case SHOW_ACCOUNT_LINK_REMINDER:
      return {
        ...state,
        isModalOpen: true,
      };

    case HIDE_ACCOUNT_LINK_REMINDER:
      return {
        ...state,
        isModalOpen: false,
      };

    default:
      return state;
  }
}

import {
  HIDE_ACCOUNT_LINK_REMINDER,
  SHOW_ACCOUNT_LINK_REMINDER,
} from 'actiontypes/accountLinkReminder';
import { ActionCreator } from 'redux';

export type ShowAccountLinkReminder = { type: typeof SHOW_ACCOUNT_LINK_REMINDER };
export type HideAccountLinkReminder = { type: typeof HIDE_ACCOUNT_LINK_REMINDER };

export type AccountLinkReminderActions = ShowAccountLinkReminder | HideAccountLinkReminder;

export const showAccountLinkReminder: ActionCreator<ShowAccountLinkReminder> = () => ({
  type: SHOW_ACCOUNT_LINK_REMINDER,
});

export const hideAccountLinkReminder: ActionCreator<HideAccountLinkReminder> = () => ({
  type: HIDE_ACCOUNT_LINK_REMINDER,
});

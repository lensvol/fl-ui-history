import { ActionCreator } from "redux";

import accept, { AcceptAction } from "actions/messages/accept";
import cancel, { CancelAction } from "actions/messages/cancel";
import clearCache, { ClearMessagesCache } from "actions/messages/clearCache";
import closeDialog, { CloseDialog } from "actions/messages/closeDialog";
import deleteMessage, { DeleteAction } from "actions/messages/deleteMessage";
import emailMessage, { EmailAction } from "actions/messages/emailMessage";
import fetch, { FetchAllAction } from "actions/messages/fetch";
import fetchFeedMessages, {
  FetchFeedMessagesAction,
} from "actions/messages/fetchFeedMessages";
import fetchInteractions, {
  FetchInteractionsAction,
} from "actions/messages/fetchInteractions";
import reject, { RejectAction } from "actions/messages/reject";

import { CLEAR_NOTIFICATION } from "actiontypes/messages";

type ClearNotification = {
  type: typeof CLEAR_NOTIFICATION;
};

const clearNotification: ActionCreator<ClearNotification> = () => ({
  type: CLEAR_NOTIFICATION,
});

export type MessagesAction =
  | AcceptAction
  | CancelAction
  | ClearMessagesCache
  | ClearNotification
  | CloseDialog
  | DeleteAction
  | EmailAction
  | FetchAllAction
  | FetchFeedMessagesAction
  | FetchInteractionsAction
  | RejectAction;

export {
  accept,
  cancel,
  clearCache,
  clearNotification,
  closeDialog,
  deleteMessage,
  emailMessage,
  fetch,
  fetchFeedMessages,
  fetchInteractions,
  reject,
};

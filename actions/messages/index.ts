import { ActionCreator } from "redux";

import acceptInvitation, {
  AcceptAction,
} from "actions/messages/acceptInvitation";
import cancelInvitation, {
  CancelAction,
} from "actions/messages/cancelInvitation";
import clearCache, { ClearMessagesCache } from "actions/messages/clearCache";
import closeDialog, { CloseDialog } from "actions/messages/closeDialog";
import deleteMessage, { DeleteAction } from "actions/messages/deleteMessage";
import emailMessage, { EmailAction } from "actions/messages/emailMessage";
import fetchMessages, { FetchAllAction } from "actions/messages/fetch";
import fetchInteractions, {
  FetchInteractionsAction,
} from "actions/messages/fetchInteractions";
import rejectInvitation, {
  RejectAction,
} from "actions/messages/rejectInvitation";

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
  | FetchInteractionsAction
  | RejectAction;

export {
  acceptInvitation,
  cancelInvitation,
  clearCache,
  clearNotification,
  closeDialog,
  deleteMessage,
  emailMessage,
  fetchInteractions,
  fetchMessages,
  rejectInvitation,
};

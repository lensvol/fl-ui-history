import { CLEAR_NOTIFICATION } from "actiontypes/messages";
import { ActionCreator } from "redux";
import accept, { AcceptAction } from "./accept";
import cancel, { CancelAction } from "./cancel";
import clearCache, { ClearMessagesCache } from "./clearCache";
import closeDialog, { CloseDialog } from "./closeDialog";
import deleteMessage, { DeleteAction } from "./deleteMessage";
import emailMessage, { EmailAction } from "./emailMessage";
import fetch, { FetchAllAction } from "./fetch";
import fetchFeedMessages, {
  FetchFeedMessagesAction,
} from "./fetchFeedMessages";
import fetchInteractions, {
  FetchInteractionsAction,
} from "./fetchInteractions";
import reject, { RejectAction } from "./reject";

export type ClearNotification = { type: typeof CLEAR_NOTIFICATION };
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
  clearCache,
  clearNotification,
  accept,
  cancel,
  closeDialog,
  deleteMessage,
  emailMessage,
  fetch,
  fetchFeedMessages,
  fetchInteractions,
  reject,
};

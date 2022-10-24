import { CLOSE_DIALOG } from "actiontypes/messages";

export type CloseDialog = { type: typeof CLOSE_DIALOG };

export default function closeDialog(): CloseDialog {
  return { type: CLOSE_DIALOG };
}

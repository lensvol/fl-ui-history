import { ActionCreator } from "redux";

import { TOGGLE_JOURNAL_VIEW } from "actiontypes/myself";

export type ToggleJournalView = {
  type: typeof TOGGLE_JOURNAL_VIEW;
};

export const toggleJournalView: ActionCreator<ToggleJournalView> = () => ({
  type: TOGGLE_JOURNAL_VIEW,
});

export default toggleJournalView;

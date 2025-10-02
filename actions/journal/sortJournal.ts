import { ActionCreator } from "redux";

import { SORT_JOURNAL_SUCCESS } from "actiontypes/journal";

import { JournalSortByOption } from "types/journal";

export type JournalSortAction = {
  type: typeof SORT_JOURNAL_SUCCESS;
  payload: JournalSortByOption;
};

const sortJournal: ActionCreator<JournalSortAction> = (
  data: JournalSortByOption
) => ({
  type: SORT_JOURNAL_SUCCESS,
  payload: data,
});

export default sortJournal;

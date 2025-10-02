import { ActionCreator } from "redux";

import { FILTER_JOURNAL_SUCCESS } from "actiontypes/journal";

import { JournalFilterByOption } from "types/journal";

export type JournalFilterAction = {
  type: typeof FILTER_JOURNAL_SUCCESS;
  payload: JournalFilterByOption;
};

const filterJournal: ActionCreator<JournalFilterAction> = (
  data: JournalFilterByOption
) => ({
  type: FILTER_JOURNAL_SUCCESS,
  payload: data,
});

export default filterJournal;

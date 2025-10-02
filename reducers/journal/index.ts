import { AttachJournalTagActions } from "actions/journal/attachJournalTag";
import { CreateJournalTagActions } from "actions/journal/createJournalTag";
import { DeleteJournalEntryActions } from "actions/journal/deleteEntry";
import { DeleteJournalTagActions } from "actions/journal/deleteJournalTag";
import { DetachJournalTagActions } from "actions/journal/detachJournalTag";
import { FetchJournalFavoriteActions } from "actions/journal/fetchJournalFavorites";
import { FetchJournalPageActions } from "actions/journal/fetchJournalPage";
import { FetchJournalTagActions } from "actions/journal/fetchJournalTags";
import { JournalFilterAction } from "actions/journal/filterJournal";
import { JournalSortAction } from "actions/journal/sortJournal";
import { UpdateJournalTagActions } from "actions/journal/updateJournalTag";

import {
  ATTACH_JOURNAL_TAG_SUCCESS,
  CREATE_JOURNAL_TAG_SUCCESS,
  DELETE_JOURNAL_ENTRY_SUCCESS,
  DELETE_JOURNAL_TAG_SUCCESS,
  DETACH_JOURNAL_TAG_SUCCESS,
  FETCH_JOURNAL_FAVORITE_SUCCESS,
  FETCH_JOURNAL_PAGE_SUCCESS,
  FETCH_JOURNAL_TAG_SUCCESS,
  FILTER_JOURNAL_SUCCESS,
  SORT_JOURNAL_SUCCESS,
  UPDATE_JOURNAL_TAG_SUCCESS,
} from "actiontypes/journal";

import {
  IJournalState,
  JournalEntry,
  JournalFilterByNone,
  JournalTagSortByNewest,
} from "types/journal";

const INITIAL_STATE: IJournalState = {
  entries: undefined,
  favorites: [],
  filterBy: JournalFilterByNone,
  next: undefined,
  page: 0,
  pageCount: 0,
  previous: undefined,
  tags: [],
  sortBy: JournalTagSortByNewest,
};

type JournalAction =
  | AttachJournalTagActions
  | CreateJournalTagActions
  | DeleteJournalEntryActions
  | DeleteJournalTagActions
  | DetachJournalTagActions
  | FetchJournalFavoriteActions
  | FetchJournalPageActions
  | FetchJournalTagActions
  | JournalFilterAction
  | JournalSortAction
  | UpdateJournalTagActions;

export default function reducer(
  state = INITIAL_STATE,
  action: JournalAction
): IJournalState {
  switch (action.type) {
    case FETCH_JOURNAL_PAGE_SUCCESS:
    case DELETE_JOURNAL_ENTRY_SUCCESS:
      return {
        ...state,
        entries: action.payload.shares.map(
          (entry) =>
            ({
              id: entry.id,
              eventName: entry.eventName,
              areaName: entry.areaName,
              fallenLondonDateTime: entry.fallenLondonDateTime,
              playerMessage: entry.playerMessage,
              tags: entry.tags ?? [],
            }) as JournalEntry
        ),
        page: action.payload.page,
        pageCount: action.payload.pageCount,
        previous: action.payload.hasPrevious
          ? action.payload.page - 1
          : undefined,
        next: action.payload.hasNext ? action.payload.page + 1 : undefined,
      };

    case FETCH_JOURNAL_FAVORITE_SUCCESS:
      return {
        ...state,
        favorites: action.payload.shares.map(
          (entry) =>
            ({
              id: entry.id,
              eventName: entry.eventName,
              areaName: entry.areaName,
              fallenLondonDateTime: entry.fallenLondonDateTime,
              playerMessage: entry.playerMessage,
            }) as JournalEntry
        ),
      };

    case FILTER_JOURNAL_SUCCESS:
      return {
        ...state,
        filterBy: action.payload,
      };

    case SORT_JOURNAL_SUCCESS:
      return {
        ...state,
        sortBy: action.payload,
      };

    case CREATE_JOURNAL_TAG_SUCCESS:
      return {
        ...state,
        tags: [...state.tags, action.payload],
      };

    case FETCH_JOURNAL_TAG_SUCCESS:
      return {
        ...state,
        tags: action.payload.tags,
      };

    case DELETE_JOURNAL_TAG_SUCCESS:
      return {
        ...state,
        tags: action.payload.tags,
        entries:
          state.entries?.map((entry) => ({
            ...entry,
            tags: entry.tags.filter((tag) => tag.id !== action.payload.tagId),
          })) ?? [],
      };

    case UPDATE_JOURNAL_TAG_SUCCESS:
      return {
        ...state,
        tags: action.payload.tags,
        entries:
          state.entries?.map((entry) => ({
            ...entry,
            tags: entry.tags.map(
              (tag) => action.payload.tags.find((t) => t.id === tag.id) ?? tag
            ),
          })) ?? [],
      };

    case ATTACH_JOURNAL_TAG_SUCCESS:
      return {
        ...state,
        entries:
          state.entries?.map((entry) => ({
            ...entry,
            tags:
              entry.id === action.payload.entryId
                ? action.payload.tags
                : entry.tags,
          })) ?? [],
      };

    case DETACH_JOURNAL_TAG_SUCCESS:
      return {
        ...state,
        entries:
          state.entries?.map((entry) => ({
            ...entry,
            tags:
              entry.id === action.payload.entryId
                ? action.payload.tags
                : entry.tags,
          })) ?? [],
      };

    default:
      return state;
  }
}

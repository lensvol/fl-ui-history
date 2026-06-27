export type JournalTagColor =
  "None" | "Green" | "Red" | "Yellow" | "Blue" | "Violet";

export type JournalTagEntry = {
  id: number;
  name: string;
  isFavorite: boolean;
  color: JournalTagColor;
};

export type JournalFilterByOption = {
  label: string;
  value: number;
  type: "journal";
};

export const JournalFilterByNone: JournalFilterByOption = {
  label: "No Filter",
  value: 0,
  type: "journal",
};

export type JournalSortByOption = {
  label: string;
  value: number;
  type: "journal";
};

export const JournalTagSortByNewest: JournalSortByOption = {
  label: "Newest",
  value: 0,
  type: "journal",
};

export const JournalTagSortByOldest: JournalSortByOption = {
  label: "Oldest",
  value: 1,
  type: "journal",
};

export type JournalEntry = {
  id: number;
  eventName: string;
  areaName: string;
  fallenLondonDateTime: string;
  playerMessage: string;
  tags: JournalTagEntry[];
};

export interface IJournalState {
  entries?: JournalEntry[];
  favorites: JournalEntry[];
  filterBy: JournalFilterByOption;
  page: number;
  pageCount: number;
  sortBy: JournalSortByOption;
  tags: JournalTagEntry[];
  previous?: number;
  next?: number;
}

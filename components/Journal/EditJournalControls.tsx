import React, { useCallback, useMemo, useRef, useState } from "react";

import { useDispatch } from "react-redux";

import Select from "react-select";

import fetchJournalPage from "actions/journal/fetchJournalPage";
import filterJournal from "actions/journal/filterJournal";
import sortJournal from "actions/journal/sortJournal";

import { styles, theme } from "components/Equipment/dropdown-styles";
import ManageTagsModal from "components/Journal/ManageTagsModal";

import { useAppSelector } from "features/app/store";

import {
  JournalFilterByOption,
  JournalFilterByNone,
  JournalTagSortByOldest,
  JournalTagSortByNewest,
} from "types/journal";

const SortByOptions = [JournalTagSortByNewest, JournalTagSortByOldest];

export type Props = {
  isUpdating: boolean;
  setIsUpdating: (value: boolean) => void;
};

export default function EditJournalControls({
  isUpdating,
  setIsUpdating,
}: Props) {
  const dispatch = useDispatch();

  const filterBy = useAppSelector((state) => state.journal.filterBy);
  const sortBy = useAppSelector((state) => state.journal.sortBy);
  const tags = useAppSelector((state) => state.journal.tags);

  const ref = useRef<HTMLDivElement>(null);

  const [isTagModalOpen, setIsTagModalOpen] = useState(false);

  const filterByOptions = useMemo(() => {
    const tagOptions = tags.map(
      (tag) =>
        ({
          label: tag.name,
          value: tag.id,
          type: "journal",
        }) as JournalFilterByOption
    );

    return [JournalFilterByNone, ...tagOptions];
  }, [tags]);

  const onChangeSortBy = useCallback(
    async (option) => {
      if (!option) {
        return;
      }

      if (option.value === sortBy.value) {
        return;
      }

      setIsUpdating(true);

      await dispatch(sortJournal(option));
      await dispatch(
        fetchJournalPage({
          filterBy,
          page: 0,
          sortBy: option,
        })
      );

      setIsUpdating(false);
    },
    [dispatch, filterBy, setIsUpdating, sortBy]
  );

  const onChangeFilterBy = useCallback(
    async (option) => {
      if (!option) {
        return;
      }

      if (option.value === filterBy.value) {
        return;
      }

      setIsUpdating(true);

      await dispatch(filterJournal(option));
      await dispatch(
        fetchJournalPage({
          filterBy: option,
          page: 0,
          sortBy,
        })
      );

      setIsUpdating(false);
    },
    [dispatch, filterBy, setIsUpdating, sortBy]
  );

  const onShowTagModal = useCallback(() => {
    setIsTagModalOpen(!isTagModalOpen);
  }, [isTagModalOpen]);

  return (
    <>
      <div className="edit-journal-controls">
        <div className="edit-journal-control">
          <span>Sort by:</span>
          <div>
            <Select
              components={{
                IndicatorSeparator: () => null,
              }}
              isClearable={false}
              isDisabled={isUpdating}
              isSearchable={false}
              onChange={onChangeSortBy}
              options={SortByOptions}
              styles={styles}
              theme={theme}
              value={sortBy}
            />
          </div>
        </div>
        <div className="edit-journal-control">
          <span>Filter by tag:</span>
          <div>
            <Select
              components={{
                IndicatorSeparator: () => null,
              }}
              isClearable={false}
              isDisabled={isUpdating}
              isSearchable={false}
              onChange={onChangeFilterBy}
              options={filterByOptions}
              styles={styles}
              theme={theme}
              value={filterBy}
            />
          </div>
        </div>
        <div>
          <div
            className="journal-manage-tags"
            onClick={onShowTagModal}
            ref={ref}
          >
            Manage Tags...
          </div>
        </div>
      </div>

      <ManageTagsModal
        isEditing={true}
        isOpen={isTagModalOpen}
        onRequestClose={onShowTagModal}
        overlayRef={ref}
      />
    </>
  );
}

EditJournalControls.displayName = "EditJournalControls";

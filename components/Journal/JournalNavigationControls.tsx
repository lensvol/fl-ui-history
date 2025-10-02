import React, { useCallback } from "react";

import { useDispatch } from "react-redux";

import classnames from "classnames";

import moment from "moment";

import fetchJournalPage from "actions/journal/fetchJournalPage";

import JournalDatePicker from "components/JournalEntries/JournalDatePicker";
import NavigationButton from "components/JournalEntries/NavigationButton";

import { useAppSelector } from "features/app/store";

export type Props = {
  isUpdating: boolean;
  setIsUpdating: (value: boolean) => void;
};

export default function JournalNavigationControls({
  isUpdating,
  setIsUpdating,
}: Props) {
  const dispatch = useDispatch();

  const page = useAppSelector((state) => state.journal.page);
  const pageCount = useAppSelector((state) => state.journal.pageCount);
  const sortBy = useAppSelector((state) => state.journal.sortBy);
  const filterBy = useAppSelector((state) => state.journal.filterBy);
  const previousPage = useAppSelector((state) => state.journal.previous);
  const nextPage = useAppSelector((state) => state.journal.next);

  const onClickNext = useCallback(async () => {
    if (!nextPage) {
      return;
    }

    if (nextPage === page) {
      return;
    }

    setIsUpdating(true);

    await dispatch(
      fetchJournalPage({
        filterBy,
        page: nextPage,
        sortBy,
      })
    );

    setIsUpdating(false);
  }, [dispatch, filterBy, nextPage, page, setIsUpdating, sortBy]);

  const onClickPrevious = useCallback(async () => {
    if (previousPage === undefined) {
      return;
    }

    if (previousPage === page) {
      return;
    }

    setIsUpdating(true);

    await dispatch(
      fetchJournalPage({
        page: previousPage,
        sortBy,
        filterBy,
      })
    );

    setIsUpdating(false);
  }, [dispatch, filterBy, page, previousPage, setIsUpdating, sortBy]);

  const onJumpToDate = useCallback(
    async (value: Date) => {
      const date = moment(value).format("YYYY-MM-DD");

      setIsUpdating(true);

      await dispatch(
        fetchJournalPage({
          date,
          sortBy,
          filterBy,
        })
      );

      setIsUpdating(false);
    },
    [dispatch, filterBy, setIsUpdating, sortBy]
  );

  return (
    <div className="journal-navigation-header">
      <div className="journal-navigation">
        <NavigationButton
          classNames={{
            className: "journal-nav-button",
            faClassName: "fa-arrow-left",
            innerClassName: "journal-nav-button-inner",
          }}
          isDisabled={previousPage === undefined}
          isFetching={isUpdating}
          label="Previous"
          onClick={onClickPrevious}
        />

        <JournalDatePicker
          classNames={{
            datePickerClassName: classnames(
              "journal-nav-date-button-inner",
              isUpdating && "journal-entries__control--disabled"
            ),
            iconClassName: "journal-nav-calendar",
            wrapperClassName: "journal-nav-button",
          }}
          isDisabled={isUpdating}
          onChange={onJumpToDate}
        />

        <NavigationButton
          classNames={{
            className: "journal-nav-button",
            faClassName: "journal-nav-right-arrow",
            innerClassName: "journal-nav-button-inner",
          }}
          isDisabled={nextPage === undefined}
          isFetching={isUpdating}
          label="Next"
          onClick={onClickNext}
        />
      </div>

      <div>
        Page {(page + 1).toLocaleString("en-GB")} of{" "}
        {Math.max(pageCount, 1).toLocaleString("en-GB")}
      </div>
    </div>
  );
}

JournalNavigationControls.displayName = "JournalNavigationControls";

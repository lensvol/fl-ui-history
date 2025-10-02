import React from "react";

import JournalDatePicker from "components/JournalEntries/JournalDatePicker";
import NavigationButton from "components/JournalEntries/NavigationButton";

interface Props {
  hasNext: boolean;
  hasPrevious: boolean;
  isFetching: boolean;
  onJumpToDate: (date: Date) => Promise<void>;
  onNext: () => void;
  onPrev: () => void;
}

export default function NavigationControls({
  hasNext,
  hasPrevious,
  isFetching,
  onJumpToDate,
  onNext,
  onPrev,
}: Props) {
  return (
    <div className="journal-entries__controls">
      {hasNext && (
        <NavigationButton
          classNames={{
            className: "button--link",
            faClassName: "fa-arrow-left",
          }}
          isFetching={isFetching}
          label="Older"
          onClick={onNext}
        />
      )}
      <JournalDatePicker
        classNames={{
          iconClassName: "link",
        }}
        isDisabled={isFetching}
        onChange={onJumpToDate}
      />
      {hasPrevious && (
        <NavigationButton
          classNames={{
            className: "button--link",
            faClassName: "fa-arrow-right",
          }}
          isFetching={isFetching}
          label="Newer"
          onClick={onPrev}
        />
      )}
    </div>
  );
}

NavigationControls.displayName = "NavigationControls";

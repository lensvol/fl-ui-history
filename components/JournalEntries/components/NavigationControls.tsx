import React from "react";

import JournalDatePicker from "./JournalDatePicker";
import NavigationButton from "./NavigationButton";

interface Props {
  fetchDirection: "next" | "prev" | undefined;
  isFetching: boolean;
  next: string | null | undefined;
  onJumpToDate: (date: Date) => Promise<void>;
  onNext: () => void;
  onPrev: () => void;
  prev: string | null | undefined;
}

export default function NavigationControls({
  fetchDirection,
  isFetching,
  next,
  onJumpToDate,
  onNext,
  onPrev,
  prev,
}: Props) {
  return (
    <div className="journal-entries__controls">
      {next && (
        <NavigationButton
          direction="next"
          fetchDirection={fetchDirection}
          isFetching={isFetching}
          onClick={onNext}
        />
      )}
      <JournalDatePicker onChange={onJumpToDate} />
      {prev && (
        <NavigationButton
          direction="prev"
          fetchDirection={fetchDirection}
          isFetching={isFetching}
          onClick={onPrev}
        />
      )}
    </div>
  );
}

NavigationControls.displayName = "NavigationControls";

/*
NavigationControls.propTypes = {
  fetchDirection: PropTypes.oneOf(['next', 'prev']),
  isFetching: PropTypes.bool.isRequired,
  next: PropTypes.string,
  prev: PropTypes.string,
  onJumpToDate: PropTypes.func.isRequired,
  onPrev: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
};

NavigationControls.defaultProps = {
  fetchDirection: undefined,
  next: undefined,
  prev: undefined,
};

 */

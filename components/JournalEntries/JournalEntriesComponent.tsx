import React from "react";
import { connect } from "react-redux";

import JournalEntry from "components/JournalEntry";

import { IAppState } from "types/app";
import NavigationControls from "./components/NavigationControls";

function JournalEntries({
  fetchDirection,
  isFetching,
  next,
  prev,
  onJumpToDate,
  onNext,
  onPrev,
  sharedContent,
}: Props) {
  return (
    <div className="journal-entries-container">
      <div className="journal-entries__header-and-controls">
        <h1 className="heading heading--1 journal-entries__header">Journal</h1>
        <NavigationControls
          fetchDirection={fetchDirection}
          isFetching={isFetching}
          next={next}
          onJumpToDate={onJumpToDate}
          onNext={onNext}
          onPrev={onPrev}
          prev={prev}
        />
      </div>
      <div className="journal-entries">
        {sharedContent &&
          sharedContent.map((entry) => (
            <JournalEntry isFetching={isFetching} key={entry.id} data={entry} />
          ))}
      </div>
      <NavigationControls
        fetchDirection={fetchDirection}
        isFetching={isFetching}
        next={next}
        onJumpToDate={onJumpToDate}
        onNext={onNext}
        onPrev={onPrev}
        prev={prev}
      />
    </div>
  );
}

/*
JournalEntries.propTypes = {
  fetchDirection: PropTypes.oneOf(['next', 'prev']),
  isFetching: PropTypes.bool.isRequired,
  next: PropTypes.string,
  prev: PropTypes.string,
  onJumpToDate: PropTypes.func.isRequired,
  onPrev: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  profileCharacter: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
  sharedContent: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
  })).isRequired,
};

JournalEntries.defaultProps = {
  fetchDirection: undefined,
  next: undefined,
  prev: undefined,
};

 */
type OwnProps = {
  fetchDirection: "next" | "prev" | undefined;
  isFetching: boolean;
  next: string | null | undefined;
  onJumpToDate: (value: Date) => Promise<void>;
  onNext: () => void;
  onPrev: () => void;
  prev: string | null | undefined;
};

const mapStateToProps = ({
  profile: {
    // profileCharacter,
    sharedContent,
  },
}: IAppState) => ({
  // profileCharacter,
  sharedContent,
});

type Props = OwnProps & ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(JournalEntries);

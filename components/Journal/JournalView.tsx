import React, { useCallback } from "react";

import { useDispatch } from "react-redux";

import { toggleJournalView } from "actions/myself";

import InnerTabs from "components/InnerTabs";
import JournalMainView from "components/Journal/JournalMainView";
import MediaSmDown from "components/Responsive/MediaSmDown";

export default function JournalView() {
  const dispatch = useDispatch();

  const handleClickToggle = useCallback(async () => {
    dispatch(toggleJournalView());
  }, [dispatch]);

  return (
    <div>
      <MediaSmDown>
        <InnerTabs />
      </MediaSmDown>

      <div>
        <div className="edit-journal-header">
          <h1 className="heading heading--1 heading--close">Edit Journal</h1>

          <span
            className="button button--primary button--no-margin"
            onClick={handleClickToggle}
          >
            <i className="fa fa-arrow-left" /> Go back
          </span>
        </div>
        <hr />
        <JournalMainView />
      </div>
    </div>
  );
}

JournalView.displayName = "JournalView";

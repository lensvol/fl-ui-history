import React, { useEffect } from "react";

import { useDispatch } from "react-redux";

import { fetchMyself } from "actions/myself";
import { setTab } from "actions/subtabs";

import GeneralContainer from "components/GeneralContainer";
import JournalView from "components/Journal/JournalView";
import Loading from "components/Loading";
import Myself from "components/Myself";

import { useAppSelector } from "features/app/store";

export default function MyselfTab() {
  const dispatch = useDispatch();

  const hasFetched = useAppSelector((state) => state.myself.hasFetched);
  const isFetching = useAppSelector((state) => state.myself.isFetching);
  const showJournalView = useAppSelector(
    (state) => state.myself.showJournalView
  );

  useEffect(() => {
    dispatch(
      setTab({
        tab: "myself",
        subtab: "myself",
      })
    );

    asyncUseEffect(!(hasFetched || isFetching));

    // If we have no data (unlikely, but possible if there was a network issue) then fetch character data
    async function asyncUseEffect(needsFetch: boolean) {
      if (!needsFetch) {
        return;
      }

      dispatch(fetchMyself());
    }
  }, [dispatch, hasFetched, isFetching]);

  return (
    <GeneralContainer>
      {isFetching ? (
        <Loading key="loading" />
      ) : showJournalView ? (
        <JournalView />
      ) : (
        <Myself key="myself" />
      )}
    </GeneralContainer>
  );
}

MyselfTab.displayName = "MyselfTab";

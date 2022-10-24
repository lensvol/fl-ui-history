import React, { useEffect } from "react";
import { connect } from "react-redux";

import { fetchMyself } from "actions/myself";
import { setTab } from "actions/subtabs";

import GeneralContainer from "components/GeneralContainer";
import Loading from "components/Loading";
import Myself from "components/Myself";
import { IAppState } from "types/app";

type Props = ReturnType<typeof mapStateToProps> & {
  dispatch: Function;
};

function MyselfTab({ dispatch, hasFetched, isFetching }: Props) {
  useEffect(() => {
    dispatch(setTab({ tab: "myself", subtab: "myself" }));
    asyncUseEffect(!(hasFetched || isFetching));

    // If we have no data (unlikely, but possible if there was a network
    // issue) then fetch character data
    async function asyncUseEffect(needsFetch: boolean) {
      if (!needsFetch) {
        return;
      }
      dispatch(fetchMyself());
    }
  }, [dispatch, hasFetched, isFetching]);

  return (
    <GeneralContainer>
      {isFetching ? <Loading key="loading" /> : <Myself key="myself" />}
    </GeneralContainer>
  );
}

MyselfTab.displayName = "MyselfTab";

const mapStateToProps = ({
  myself: { isFetching, hasFetched },
}: IAppState) => ({
  hasFetched,
  isFetching,
});

export default connect(mapStateToProps)(MyselfTab);

import React from "react";
import { connect } from "react-redux";
import ReactCSSTransitionReplace from "react-css-transition-replace";

import EnhancedStore from "components/Fate/EnhancedStore";
import Fate from "components/Fate";
import GeneralContainer from "components/GeneralContainer";
import Loading from "components/Loading";
import { IAppState } from "types/app";

function FateContainer({ hasFetched, showEnhancedStore }: Props) {
  return (
    <GeneralContainer>
      <ReactCSSTransitionReplace
        transitionName="fade-wait"
        transitionEnterTimeout={100}
        transitionLeaveTimeout={100}
      >
        {hasFetched ? (
          showEnhancedStore ? (
            <EnhancedStore key="fate" />
          ) : (
            <Fate key="fate" />
          )
        ) : (
          <Loading key="loading" />
        )}
      </ReactCSSTransitionReplace>
    </GeneralContainer>
  );
}

FateContainer.displayName = "FateContainer";

const mapStateToProps = (state: IAppState) => ({
  hasFetched: state.fate.hasFetched,
  showEnhancedStore: state.fate.showEnhancedStore,
});

type Props = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(FateContainer);

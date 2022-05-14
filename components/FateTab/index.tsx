import React from 'react';
import { connect } from 'react-redux';
import ReactCSSTransitionReplace from 'react-css-transition-replace';

import Fate from 'components/Fate';
import GeneralContainer from 'components/GeneralContainer';
import Loading from 'components/Loading';
import { IAppState } from 'types/app';

function FateContainer({ hasFetched }: Props) {
  return (
    <GeneralContainer>
      <ReactCSSTransitionReplace
        transitionName="fade-wait"
        transitionEnterTimeout={100}
        transitionLeaveTimeout={100}
      >
        {!hasFetched ? <Loading key="loading" /> : (
          <Fate
            key="fate"
          />
        )}
      </ReactCSSTransitionReplace>
    </GeneralContainer>
  );
}

FateContainer.displayName = 'FateContainer';

const mapStateToProps = (state: IAppState) => ({
  hasFetched: state.fate.hasFetched,
});

type Props = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(FateContainer);

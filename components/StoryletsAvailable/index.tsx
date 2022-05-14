import { hideMap } from 'actions/map';
import { setTab } from 'actions/subtabs';
import Cards from 'components/Cards';
import SmallCards from 'components/Cards/components/SmallCards';
import Loading from 'components/Loading';
import MediaLgDown from 'components/Responsive/MediaLgDown';
import MediaMdUp from 'components/Responsive/MediaMdUp';
import MediaSmDown from 'components/Responsive/MediaSmDown';
import InnerTabs from 'components/StoryletsAvailable/components/InnerTabs';
import StoryletStagger from 'components/StoryletsAvailable/components/StoryletStagger';
import WelcomeAndTravel from 'components/StoryletsAvailable/components/WelcomeAndTravel';
import React, {
  Component,
  Fragment,
} from 'react';
import { connect } from 'react-redux';

import { ThunkDispatch } from 'redux-thunk';
import { IAppState } from 'types/app';
import {
  SOMETIMES,
  StoryletActiveTab as ActiveTab,
} from 'types/subtabs';

class StoryletsAvailableContainer extends Component<Props> {
  static displayName = 'StoryletsAvailableContainer';

  static defaultProps = {
    storylets: undefined,
  };

  switchTab = (subtab: ActiveTab) => {
    const { dispatch, isMapVisible } = this.props;
    dispatch(setTab({ subtab, tab: 'storylet' }));

    // If we're switching to the 'sometimes' subtab, then hide the map
    if (subtab === 'sometimes' && isMapVisible) {
      dispatch(hideMap());
    }
  };

  /**
   * render
   * @return {Object}
   */
  render() {
    const { showOps, storylets, subtab } = this.props;

    if (!storylets) {
      return <Loading spinner />;
    }

    const onTabSwitch = this.switchTab;

    return (
      <Fragment>
        <MediaLgDown>
          <MediaMdUp>
            <WelcomeAndTravel />
          </MediaMdUp>
        </MediaLgDown>

        <MediaSmDown>
          {showOps && (
            <InnerTabs
              activeTab={subtab}
              onChange={onTabSwitch}
            />
          )}
          {subtab === SOMETIMES ? <SmallCards /> : <StoryletStagger />}
        </MediaSmDown>

        <MediaMdUp>
          <Cards />
          <StoryletStagger />
        </MediaMdUp>

      </Fragment>
    );
  }
}

const mapStateToProps = (state: IAppState) => {
  const {
    map: {
      isVisible,
      showOps,
    },
    storylet: { phase, storylets },
    subtabs: { storylet: subtab },
  } = state;
  return ({
    phase,
    showOps,
    storylets,
    subtab,
    isMapVisible: isVisible,
  });
};

type Props = ReturnType<typeof mapStateToProps> & {
  dispatch: ThunkDispatch<any, any, any>,
};

export default connect(mapStateToProps)(StoryletsAvailableContainer);

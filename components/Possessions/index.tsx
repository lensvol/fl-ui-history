import React, { Component } from 'react';
import { connect } from 'react-redux';

import Equipment from 'components/Equipment';
import Inventory from 'components/Inventory';
import MediaSmDown from 'components/Responsive/MediaSmDown';

import getPossessionsCategories from 'selectors/myself/getPossessionsCategories';
import PossessionsContext from './PossessionsContext';
import InnerTabs from 'components/InnerTabs';
import { IAppState } from 'types/app';

interface State {
  filterString: string,
}

export class PossessionsContainer extends Component<Props, State> {
  static displayName = 'PossessionsContainer';

  state = {
    filterString: '',
  };

  handleFilter = (evt: any) => {
    this.setState({ filterString: evt.target.value });
  };

  render = () => {
    const {
      categories,
      storyletPhase,
    } = this.props;
    const { filterString } = this.state;
    return (
      <PossessionsContext.Provider
        value={{
          categories,
          filterString,
          currentlyInStorylet: storyletPhase !== 'Available',
          onFilter: this.handleFilter,
        }}
      >
        <div className="possessions">
          <MediaSmDown>
            <InnerTabs />
          </MediaSmDown>
          <div style={{ display: 'flex' }}>
            <h1 className="heading heading--1 heading--close">My Possessions</h1>
          </div>

          <hr />

          <Equipment />

          <hr />

          <Inventory
            categories={categories}
            filterString={filterString}
            onFilter={this.handleFilter}
          />
        </div>
      </PossessionsContext.Provider>
    );
  }
}

type Props = ReturnType<typeof mapStateToProps> & {
  dispatch: Function,
};

const mapStateToProps = (state: IAppState) => ({
  categories: getPossessionsCategories(state),
  isFetching: state.myself.isFetching,
  storyletPhase: state.storylet.phase,
});

export default connect(mapStateToProps)(PossessionsContainer);

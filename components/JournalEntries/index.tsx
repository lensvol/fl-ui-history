import * as profileActions from 'actions/profile';
import JournalEntry from 'components/JournalEntry/JournalEntryContainer';
import moment from 'moment';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  RouteComponentProps,
  withRouter,
} from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { Success } from 'services/BaseMonadicService';
import { IAppState } from 'types/app';
import NavigationControls from './NavigationControls';

const qs = require('query-string'); // eslint-disable-line @typescript-eslint/no-var-requires

interface State {
  fetchDirection?: 'next' | 'prev',
  isFetching: boolean,
}

const INITIAL_STATE = {
  fetchDirection: undefined,
  isFetching: false,
};

export class JournalEntriesContainer extends Component<Props, State> {
  state = { ...INITIAL_STATE };

  static displayName = 'JournalEntriesContainer';

  componentDidMount = () => {
    const { dispatch, location, match } = this.props;
    const {
      fromEchoId,
      profileName: characterName,
    } = match.params;

    // For compatibility, accept either of the following paths:
    // /profile/:profileName/:fromEchoId
    // /profile/:profileName?fromEchoId=xxxxxxx
    const fromId = fromEchoId ?? qs.parse(location.search)['fromEchoId']; // eslint-disable-line dot-notation

    dispatch(profileActions.fetchSharedContent({
      characterName,
      fromId,
    }));
  };

  handleFetchDirection = async (direction: 'next' | 'prev') => {
    const {
      dispatch,
      history,
      match: { params: { profileName } },
      [direction]: url,
    } = this.props;

    if (url) {
      // Retrieve the next/prev data
      this.setState({ isFetching: true, fetchDirection: direction });
      const response = await dispatch(profileActions.fetchSharedContentByUrl(url));
      this.setState({ ...INITIAL_STATE });
      if (response instanceof Success) {
        const { shares } = response.data;
        // Update the address bar so that users can share where they are a bit
        // more easily
        if (shares.length) {
          history.replace(`/profile/${profileName}/${shares[0].id}`);
        }
      }
    }
  };

  handleJumpToDate = async (value: Date) => {
    const { dispatch, history, match: { params } } = this.props;
    const { profileName: characterName } = params;
    const date = moment(value).format('YYYY-MM-DD');
    const response = await dispatch(profileActions.fetchSharedContent({ characterName, date }));
    if (response instanceof Success) {
      const { shares } = response.data;
      // Update the address bar so that users can share where they are a bit
      // more easily
      if (shares && shares.length) {
        history.replace(`/profile/${characterName}/${shares[0].id}`);
      }
    }
  };

  handleNext = () => {
    this.handleFetchDirection('next');
  };

  handlePrev = () => {
    this.handleFetchDirection('prev');
  };

  render = () => {
    const {
      next,
      prev,
      sharedContent,
    } = this.props;

    const { fetchDirection, isFetching } = this.state;
    return (
      <div className="journal-entries-container">
        <div className="journal-entries__header-and-controls">
          <h1 className="heading heading--1 journal-entries__header">Journal</h1>
          <NavigationControls
            fetchDirection={fetchDirection}
            isFetching={isFetching}
            next={next}
            onJumpToDate={this.handleJumpToDate}
            onNext={this.handleNext}
            onPrev={this.handlePrev}
            prev={prev}
          />
        </div>
        <div className="journal-entries">
          {sharedContent && sharedContent.map(entry => (
            <JournalEntry
              isFetching={isFetching}
              key={entry.id}
              data={entry}
            />
          ))}
        </div>
        <NavigationControls
          fetchDirection={fetchDirection}
          isFetching={isFetching}
          next={next}
          onJumpToDate={this.handleJumpToDate}
          onNext={this.handleNext}
          onPrev={this.handlePrev}
          prev={prev}
        />
      </div>
    );
  }
}

const mapStateToProps = ({
  profile: {
    next,
    prev,
    sharedContent,
  },
}: IAppState) => ({ next, prev, sharedContent });

type MatchProps = {
  fromEchoId?: string,
  profileName: string,
};

type Props = ReturnType<typeof mapStateToProps> & RouteComponentProps<MatchProps> & {
  dispatch: ThunkDispatch<any, any, any>,
};

export default withRouter(connect(mapStateToProps)(JournalEntriesContainer));

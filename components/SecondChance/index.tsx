import SecondChanceComponent from 'components/SecondChance/SecondChanceComponent';
import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { IAppState } from 'types/app';

import * as StoryletActionCreators from 'actions/storylet';

type Props =
  ReturnType<typeof mapStateToProps>
  & RouteComponentProps
  & { dispatch: Function };

export function SecondChance({
  dispatch,
  history,
  messages,
  phase,
  secondChance,
  storylet,
}: Props) {
  const goBack = useCallback(() => {
    if (phase === 'InItemUse') {
      history.push('/possessions');
    }
    dispatch(StoryletActionCreators.goBack());
  }, [dispatch, history, phase]);

  return (
    <SecondChanceComponent
      messages={messages}
      onGoBack={goBack}
      secondChance={secondChance}
      storylet={storylet}
    />
  );

}

const mapStateToProps = (state: IAppState) => ({
  secondChance: state.storylet.secondChance,
  messages: state.storylet.messages,
  phase: state.storylet.phase,
  storylet: state.storylet.storylet,
});

export default withRouter(connect(mapStateToProps)(SecondChance));

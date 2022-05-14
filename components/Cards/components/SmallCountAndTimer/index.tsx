import Loading from 'components/Loading';
import React from 'react';
import { connect } from 'react-redux';
import { IAppState } from 'types/app';

import SmallCardCount from './SmallCardCount';

const mapStateToProps = ({ cards: { isFetching } }: IAppState) => ({ isFetching });

export function SmallCountAndTimer(props: ReturnType<typeof mapStateToProps>) {
  const {
    isFetching,
  } = props;

  if (isFetching) {
    return <Loading spinner small />;
  }
  return (
    <div>
      <SmallCardCount />
      {' '}
      {/*
      <CardTimer formatter={str => `(${str}.)`} />
      */}
    </div>
  );
}

SmallCountAndTimer.displayName = 'SmallCountAndTimer';

export default connect(mapStateToProps)(SmallCountAndTimer);
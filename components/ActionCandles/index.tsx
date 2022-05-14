import React from 'react';
import { connect } from 'react-redux';

import { IAppState } from 'types/app';
import Candle from './Candle';
import { getContainerTop } from './utils';

function ActionCandles({ actions, isExceptionalFriend }: Props) {
  // Exceptional Friends have 40 actions, which are rendered as two candles
  const isExceptional = isExceptionalFriend;

  // We want to pin the candles to the top of the sidebar, overlapping the
  // area header, so we need to set the 'top' dynamically to the height of
  // the tallest candle
  const containerTop = getContainerTop(actions, isExceptional);

  // For EFS, return two candles (one of which may be snuffed)
  if (isExceptional) {
    return (
      <div
        className="candle-container"
        style={{ top: containerTop }}
      >
        <Candle actions={Math.min(actions, 20)} />
        <Candle
          actions={Math.max(actions - 20, 0)}
          right
        />
      </div>
    );
  }

  // For non-EFs, return a single candle
  return (
    <div
      className="candle-container"
      style={{ top: containerTop }}
    >
      <Candle actions={actions} />
    </div>
  );
}

ActionCandles.displayName = 'ActionCandles';

const mapStateToProps = ({
  actions: { actions },
  fate: { isExceptionalFriend },
}: IAppState) => ({ actions, isExceptionalFriend });

type Props = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(ActionCandles);
import React from 'react';

import {
  getBackgroundImageUrl,
  getHeight,
} from './utils';
import { CANDLE_TOP } from './constants';

export default function Candle({ actions, right }: Props) {
  const url = getBackgroundImageUrl({ actions, right });
  return (
    <div
      style={{
        background: `url(${url}) left bottom no-repeat`,
        bottom: '0',
        height: `${getHeight({ actions })}px`,
        width: '65px',
      }}
    >
      {actions > 0 && (
        <div
          style={{
            width: '65px',
            height: '75px',
            background: `url(${CANDLE_TOP}) left top no-repeat`,
            marginTop: '-45px',
          }}
        />
      )}
    </div>
  );
}

Candle.displayName = 'Candle';

type Props = {
  actions: number,
  right?: boolean,
};

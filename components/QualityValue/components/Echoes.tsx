import React from 'react';
import classnames from 'classnames';

type Props = {
  invert: boolean,
  value: number,
}

export default function Echoes(
  props: Props,
) {
  const { invert, value } = props;
  const formattedValue = (value / 100).toFixed(2);
  return (
    <div className={classnames('price item__price', invert && 'price--inverted')}>
      {formattedValue}
      {' '}
    </div>
  );
}

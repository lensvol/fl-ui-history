import React from 'react';
import classnames from 'classnames';

type Props = {
  by: number,
  disabled: boolean,
  onClick: Function,
};

export default function StateChangeButtonComponent({ by, disabled, onClick }: Props) {
  return (
    <button
      type="button"
      className={classnames(
        'button button--primary exchange-ui__state-change-button',
        disabled && 'button--disabled',
      )}
      disabled={disabled}
      onClick={() => onClick(by)}
    >
      {+by > 0 && '+'}
      {by}
    </button>
  );
}
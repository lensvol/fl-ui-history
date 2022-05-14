import React, { PropsWithChildren } from 'react';
import classnames from 'classnames';

export default function PrimaryButton({ children, disabled, ...rest }: Props) {
  return (
    <button
      className={classnames(
        'button button--primary',
        disabled && 'button--disabled',
      )}
      disabled={disabled}
      type="button"
      {...rest}
    >
      {children}
    </button>
  );
}

type Props = PropsWithChildren<{
  disabled: boolean,
  onClick: (...args: unknown[]) => unknown,
}>;
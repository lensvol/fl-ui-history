import React from 'react';
import classnames from 'classnames';

export default function Tab({
  bordered,
  isActive,
  onClick,
  children,
}: Props) {
  return (
    <button
      className={classnames(
        'inner-tab',
        bordered && 'inner-tab--with-border',
        isActive && 'inner-tab--active',
      )}
      onClick={onClick}
      role="tab"
      type="button"
    >
      {children}
    </button>
  );
}

export interface Props {
  bordered?: boolean,
  children: React.ReactNode,
  isActive: boolean,
  onClick: (_?: any) => void,
}

Tab.defaultProps = {
  bordered: false,
};

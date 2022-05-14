import React, { useMemo } from 'react';
import classnames from 'classnames';

import Loading from 'components/Loading';
import { IStorylet } from "types/storylet";

export interface Props {
  disabled: boolean,
  isGoingBack: boolean,
  onClick: (e: any) => void,
  storylet: IStorylet,
}

export default function GoBack({
  disabled,
  isGoingBack,
  onClick,
  storylet,
}: Props) {

  const content = useMemo(() => {
    if (isGoingBack) {
      return <Loading spinner small />;
    }
    return (
      <span>
        <i className="fa fa-arrow-left" />
        {' '}
        Perhaps not
      </span>
    );
  }, [isGoingBack]);

  if (!storylet.canGoBack) {
    return null;
  }

  return (
    <button
      className={classnames(
        'button button--primary',
        (isGoingBack || disabled) && 'button--disabled',
      )}
      disabled={disabled || isGoingBack}
      onClick={onClick}
      type="button"
    >
      {content}
    </button>
  );
}

GoBack.displayName = 'GoBack';

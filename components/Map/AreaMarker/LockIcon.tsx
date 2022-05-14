import React from 'react';
import classnames from 'classnames';
import { IStateAwareArea } from 'types/map';

export interface Props {
  area: IStateAwareArea,
  selected?: boolean,
}

export default function LockIcon({ selected = false }: Props) {
  return (
    <img
      alt=""
      src={'/img/lock-icon.png'}
      className={classnames(
        'interactive-marker__lock-icon',
        selected && 'interactive-marker__lock-icon--selected',
      )}
    />
  );
}

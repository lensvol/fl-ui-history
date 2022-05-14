import React, { Fragment } from 'react';

interface Props {
  cap?: number,
  level?: number,
  levelDescription?: string,
  name?: string,
}

export default function LevelDescription({
  cap,
  level,
  levelDescription,
  name,
}: Props) {
  if (levelDescription) {
    return <span className="item__name" dangerouslySetInnerHTML={{ __html: levelDescription }} />;
  }
  return (
    <Fragment>
      <span className="item__name" dangerouslySetInnerHTML={{ __html: name ?? '' }} />
      {' '}
      <span className="item__value">
        {level}
        {cap !== undefined && ` / ${cap}`}
      </span>
    </Fragment>
  );
}

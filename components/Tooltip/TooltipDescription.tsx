import WorldQualityDescription from 'components/Tooltip/WorldQualityDescription';
import React, { Fragment } from 'react';
import { IEnhancement } from 'types/qualities';
import EnhancementDescription from './EnhancementDescription';

import LevelDescription from './LevelDescription';

interface Props {
  description?: string,
  enhancements?: IEnhancement[],
  level?: number,
  levelDescription?: string,
  name?: string,
  secondaryDescription?: string,
  needsWorldQualityDescription?: boolean,
}

export default function TooltipDescription(props: Props) {
  const {
    description,
    enhancements,
    needsWorldQualityDescription,
    secondaryDescription,
  } = props;

  return (
    <Fragment>
      <LevelDescription {...props} />
      <p>
        <span dangerouslySetInnerHTML={{ __html: description ?? '' }} />
        {(enhancements?.length ?? 0) > 0 && <EnhancementDescription enhancements={enhancements} />}
      </p>
      <div
        className="tooltip__secondary-description"
        dangerouslySetInnerHTML={{ __html: secondaryDescription ?? '' }}
      />
      {needsWorldQualityDescription && <WorldQualityDescription />}
    </Fragment>
  );
}

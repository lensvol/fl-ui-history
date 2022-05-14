import React, { Fragment } from 'react';
import { ApiQualityRequirement } from 'types/storylet';
import QualityRequirement from 'components/QualityRequirement';

export interface Props {
  requirements: ApiQualityRequirement[],
}

export default function QualityRequirements({ requirements }: Props) {
  // We have to copy the list because Array.prototype.reverse operates
  // in-place with mutation. This is the kind of thing that makes it
  // hard to defend JavaScript.
  return (
    <Fragment>
      {[...requirements]
        .reverse()
        .map(quality => (
          <QualityRequirement
            key={quality.qualityId}
            data={quality}
          />
        ))
      }
    </Fragment>
  );
}

QualityRequirements.displayName = 'QualityRequirements';
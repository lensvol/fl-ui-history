import React from 'react';
import { connect } from 'react-redux';

import Image from 'components/Image';
import TippyWrapper from 'components/TippyWrapper';

import { IAppState } from 'types/app';

export function Lodgings({
  description,
  image,
  name,
  owner,
}: Props) {
  if (!name) {
    return null;
  }

  return (
    <TippyWrapper tooltipData={{ description, name }}>
      <div className="myself-profile__lodgings-container">
        <Image
          borderContainerClassName="myself-profile__lodgings-border"
          className="myself-profile__lodgings"
          icon={image}
          alt={`${owner}'s lodgings`}
          type="lodgings"
          tooltipData={{ description, name }}
          border="Unspecialised"
          defaultCursor
        />
      </div>
    </TippyWrapper>
  );
}

Lodgings.displayName = 'Lodgings';

const mapStateToProps = ({
  myself: {
    character: {
      name: owner,
      currentDomicile: {
        description,
        image,
        name,
      },
    },
  },
}: IAppState) => ({
  description,
  image,
  name,
  owner,
});

type Props = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(Lodgings);
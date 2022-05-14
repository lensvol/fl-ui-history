import React from 'react';
import PropTypes from 'prop-types';

import Image from 'components/Image';

export default function StoryletCard({
  border,
  borderColour,
  defaultCursor,
  image,
  name,
  onClick,
}: Props) {
  return (
    <div
      className="small-card storylet__card"
      onClick={onClick}
      onKeyUp={onClick}
      role="button"
      tabIndex={-1}
    >
      <Image
        borderContainerClassName="small-card__border"
        className="media__object small-card__image"
        icon={image}
        alt={name}
        border={borderColour || border}
        defaultCursor={defaultCursor}
        type="icon"
      />
    </div>
  );
}

StoryletCard.displayName = 'StoryletCard';

interface Props {
  border?: boolean,
  borderColour?: string,
  className?: string,
  defaultCursor?: boolean,
  image: string,
  imageHeight?: number,
  imageWidth?: number,
  name: string,
  onClick?: (event: any) => void,
  // onClick?: Function,
}

StoryletCard.propTypes = {
  border: PropTypes.bool,
  borderColour: PropTypes.string,
  className: PropTypes.string,
  defaultCursor: PropTypes.bool,
  image: PropTypes.string.isRequired,
  imageHeight: PropTypes.number,
  imageWidth: PropTypes.number,
  name: PropTypes.string.isRequired,
};

StoryletCard.defaultProps = {
  border: false,
  borderColour: undefined,
  className: '',
  defaultCursor: false,
  imageHeight: 0,
  imageWidth: 0,
  onClick: () => {},
};

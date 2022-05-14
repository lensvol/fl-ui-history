import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Image from 'components/Image';

export default function Avatar(props) {
  const { name, onClick, active } = props;

  const avatarClass = classnames({
    'button--link': true,
    'signup-avatar': true,
    'img-bordered': true,
    'img-selectable': true,
    'img-selected': active,
  });

  return (
    <button type="button" className={avatarClass} onClick={onClick}>
      <Image
        className="img-shadow signup-avatar__image"
        icon={name}
        alt={name}
        type="cameo"
        width={100}
        height={130}
      />
    </button>
  );
}

Avatar.displayName = 'Avatar';

Avatar.propTypes = {
  active: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};
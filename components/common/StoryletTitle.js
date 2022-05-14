import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

export default function StoryletTitle({ level = 3, className, name }) {
  return (
    <h2
      className={classnames(
        `media__heading heading heading--${level}`,
        className,
      )}
      dangerouslySetInnerHTML={{ __html: name }}
    />
  );
}

StoryletTitle.displayName = 'StoryletTitle';

StoryletTitle.propTypes = {
  className: PropTypes.string,
  level: PropTypes.number,
  name: PropTypes.string,
};

StoryletTitle.defaultProps = {
  className: undefined,
  level: 3,
  name: undefined,
};
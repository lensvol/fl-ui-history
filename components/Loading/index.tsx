import React, { CSSProperties } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import spinnerIcon from 'assets/img/oval.svg';
import hatIcon from 'assets/img/ico_story.svg';

export default function Loading(props: Props) {
  const {
    margins,
    small,
    spinner,
    style,
  } = props;

  const currentIcon = spinner ? spinnerIcon : hatIcon;

  const iconClass = classnames({
    'loading-spinner': true,
    'loading-hat': !spinner,
    'fl-ico--loading': !spinner,
    'loading-spinner--small': small,
    'loading--no-margins': !(margins ?? true),
  });

  return (
    <div className="loading-image">
      <TransitionGroup>
        <CSSTransition
          key={0}
          classnames="fade"
          timeout={{ enter: 500, exit: 200 }}
        >
          <img
            src={currentIcon}
            className={iconClass}
            alt="Loading"
            key="loading"
            style={{
              height: small ? '13px' : undefined,
              ...(style ?? {}),
            }}
          />
        </CSSTransition>
      </TransitionGroup>
    </div>
  );
}

Loading.displayName = 'Loading';

interface Props {
  margins?: boolean,
  small?: boolean,
  spinner?: boolean,
  style?: CSSProperties,
}

Loading.propTypes = {
  margins: PropTypes.bool,
  small: PropTypes.bool,
  spinner: PropTypes.bool,
};

Loading.defaultProps = {
  margins: true,
  small: false,
  spinner: false,
};
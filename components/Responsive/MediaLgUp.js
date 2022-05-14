import React from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';

import { LG } from './breakpoints';

export default function MediaLgUp({ children }) {
  return (
    <MediaQuery query={`(min-width: ${LG}px)`}>
      {children}
    </MediaQuery>
  );
}

MediaLgUp.displayName = 'MediaLgUp';

MediaLgUp.propTypes = {
  children: PropTypes.node.isRequired,
};
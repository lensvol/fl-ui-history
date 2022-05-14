import React from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';

import { SM } from './breakpoints';

export default function MediaXsDown({ children }) {
  return (
    <MediaQuery query={`(max-width: ${SM - 1}px)`}>
      {children}
    </MediaQuery>
  );
}

MediaXsDown.displayName = 'MediaXsDown';

MediaXsDown.propTypes = {
  children: PropTypes.node.isRequired,
};
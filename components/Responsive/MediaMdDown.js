import React from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';

import { LG } from './breakpoints';

export default function MediaMdDown({ children }) {
  return (
    <MediaQuery query={`(max-width: ${LG - 1}px)`}>
      {children}
    </MediaQuery>
  );
}

MediaMdDown.displayName = 'MediaMdDown';

MediaMdDown.propTypes = {
  children: PropTypes.node.isRequired,
};
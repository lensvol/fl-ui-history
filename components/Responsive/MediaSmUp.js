import React from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';

import { SM } from './breakpoints';

export default function MediaMdUp({ children }) {
  return (
    <MediaQuery query={`(min-width: ${SM}px)`}>
      {children}
    </MediaQuery>
  );
}

MediaMdUp.displayName = 'MediaMdUp';

MediaMdUp.propTypes = {
  children: PropTypes.node.isRequired,
};
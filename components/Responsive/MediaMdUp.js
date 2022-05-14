import React from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';

import { MD } from './breakpoints';

export default function MediaMdUp({ children }) {
  return (
    <MediaQuery query={`(min-width: ${MD}px)`}>
      {children}
    </MediaQuery>
  );
}

MediaMdUp.displayName = 'MediaMdUp';

MediaMdUp.propTypes = {
  children: PropTypes.node.isRequired,
};
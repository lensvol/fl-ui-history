import React from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';

import { XL } from './breakpoints';

export default function MediaXlUp({ children }) {
  return (
    <MediaQuery query={`(min-width: ${XL}px)`}>
      {children}
    </MediaQuery>
  );
}

MediaXlUp.displayName = 'MediaXlUp';

MediaXlUp.propTypes = {
  children: PropTypes.node.isRequired,
};
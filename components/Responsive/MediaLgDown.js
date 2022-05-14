import React from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';

import { XL } from './breakpoints';

export default function MediaLgDown({ children }) {
  return (
    <MediaQuery query={`(max-width: ${XL - 1}px)`}>
      {children}
    </MediaQuery>
  );
}

MediaLgDown.displayName = 'MediaLgDown';

MediaLgDown.propTypes = {
  children: PropTypes.node.isRequired,
};
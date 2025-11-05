import React from "react";
import MediaQuery from "react-responsive";

import PropTypes from "prop-types";

import { SM } from "components/Responsive/breakpoints";

export default function MediaSmUp({ children }) {
  return <MediaQuery query={`(min-width: ${SM}px)`}>{children}</MediaQuery>;
}

MediaSmUp.displayName = "MediaSmUp";

MediaSmUp.propTypes = {
  children: PropTypes.node.isRequired,
};

import React from "react";
import PropTypes from "prop-types";
import MediaQuery from "react-responsive";

import { MD } from "./breakpoints";

export default function MediaSmDown({ children }) {
  return <MediaQuery query={`(max-width: ${MD - 1}px)`}>{children}</MediaQuery>;
}

MediaSmDown.displayName = "MediaSmDown";

MediaSmDown.propTypes = {
  children: PropTypes.node.isRequired,
};

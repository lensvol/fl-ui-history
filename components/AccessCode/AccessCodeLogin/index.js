import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import LoginContainer from "components/Login";

export function AccessCodeContainer({ isFetching, ...rest }) {
  return <LoginContainer isFetchingAccessCode={isFetching} {...rest} />;
}

AccessCodeContainer.displayName = "AccessCodeContainer";

AccessCodeContainer.propTypes = {
  isFetching: PropTypes.bool.isRequired,
};

const mapStateToProps = ({ accessCodes: { isFetching } }) => ({ isFetching });

export default withRouter(connect(mapStateToProps)(AccessCodeContainer));

import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default function Tab({ bordered, active, onClick, children, style }) {
  return (
    <div
      className={classnames(
        "inner-tab",
        bordered && "inner-tab--with-border",
        active && "inner-tab--active"
      )}
      onClick={onClick}
      onKeyUp={onClick}
      role="tab"
      style={style}
      tabIndex={-1}
    >
      {children}
    </div>
  );
}

Tab.propTypes = {
  active: PropTypes.bool.isRequired,
  bordered: PropTypes.bool,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  style: PropTypes.shape({}),
};

Tab.defaultProps = {
  bordered: false,
  style: undefined,
};

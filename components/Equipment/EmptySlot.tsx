import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default function EmptySlot({ isChanging }: { isChanging: boolean }) {
  return (
    <div
      className={classnames(
        "equipment__empty-slot",
        isChanging && "equipment__empty-slot--is-changing"
      )}
      style={{
        width: "40px",
        height: "40px",
      }}
    />
  );
}

EmptySlot.displayName = "EmptySlot";

EmptySlot.propTypes = {
  isChanging: PropTypes.bool.isRequired,
};

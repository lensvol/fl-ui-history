import classnames from "classnames";
import React from "react";

export default function ResponsiveSidebarOverlay({ isOpen, onClose }: Props) {
  return (
    <div
      className={classnames(
        "sidemenu-overlay",
        isOpen && "sidemenu-overlay--open"
      )}
      onClick={onClose}
      onKeyUp={onClose}
      role="button"
      tabIndex={0}
    />
  );
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

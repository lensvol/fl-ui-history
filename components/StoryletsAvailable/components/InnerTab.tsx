import React from "react";

import classnames from "classnames";

interface Props {
  bordered: boolean;
  children: React.ReactNode;
  isActive: boolean;
  onClick: (_?: any) => void;
}

export default function InnerTab({
  bordered,
  isActive,
  onClick,
  children,
}: Props) {
  return (
    <button
      className={classnames(
        "inner-tab",
        bordered && "inner-tab--with-border",
        isActive && "inner-tab--active"
      )}
      onClick={onClick}
      role="tab"
      type="button"
    >
      {children}
    </button>
  );
}

InnerTab.displayName = "InnerTab";

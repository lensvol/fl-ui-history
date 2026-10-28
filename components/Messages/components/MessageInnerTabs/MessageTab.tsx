import React, { CSSProperties } from "react";

import classnames from "classnames";

type Props = {
  active: boolean;
  bordered: boolean;
  children: React.ReactNode;
  onClick: () => void;
  style?: CSSProperties;
};

export default function MessageTab({
  active,
  bordered,
  children,
  onClick,
  style,
}: Props) {
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

MessageTab.displayName = "MessageTab";

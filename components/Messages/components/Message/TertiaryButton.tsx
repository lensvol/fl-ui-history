import React, { PropsWithChildren } from "react";

import classnames from "classnames";

type Props = PropsWithChildren<{
  disabled: boolean;
  onClick: () => void;
}>;

export default function TertiaryButton({ children, disabled, onClick }: Props) {
  return (
    <button
      className={classnames(
        "button button--tertiary",
        disabled && "button--disabled"
      )}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

TertiaryButton.displayName = "TertiaryButton";

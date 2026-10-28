import React, { PropsWithChildren } from "react";

import classnames from "classnames";

type Props = PropsWithChildren<{
  disabled: boolean;
  onClick: (...args: unknown[]) => unknown;
}>;

export default function PrimaryButton({ children, disabled, onClick }: Props) {
  return (
    <button
      className={classnames(
        "button button--primary",
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

PrimaryButton.displayName = "PrimaryButton";

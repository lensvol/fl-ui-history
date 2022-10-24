import React, { useMemo } from "react";
import classnames from "classnames";
import TippyWrapper from "components/TippyWrapper";

import ActionCost from "./ActionCost";
import ActionCostTooltip from "./ActionCostTooltip";

interface Props {
  actionCost?: number;
  children?: React.ReactNode;
  disabled: boolean;
  isWorking?: boolean;
  go?: boolean;
  onClick: () => void;
}

export default function MainButton({
  actionCost,
  children,
  disabled,
  isWorking,
  go,
  onClick,
}: Props) {
  const hasActionCost = useMemo(
    () => actionCost !== undefined && actionCost !== 1,
    [actionCost]
  );

  const button = useMemo(
    () => (
      <button
        className={classnames(
          "js-tt button button--primary button--margin",
          go && "button--go",
          (isWorking || disabled) && "button--disabled"
        )}
        onClick={onClick}
        disabled={disabled}
        type="button"
      >
        {children}
        {!isWorking && hasActionCost && <ActionCost cost={actionCost!} />}
      </button>
    ),
    [actionCost, children, disabled, hasActionCost, go, isWorking, onClick]
  );

  if (!hasActionCost) {
    return button;
  }

  return (
    <TippyWrapper content={<ActionCostTooltip cost={actionCost!} />}>
      {button}
    </TippyWrapper>
  );
}

MainButton.displayName = "MainButton";

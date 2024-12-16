import React, { useCallback, useMemo } from "react";

import { useDispatch } from "react-redux";

import classnames from "classnames";

import { goBack } from "actions/storylet";

import ActionCost from "components/ActionButton/components/ActionCost";
import ActionCostTooltip from "components/ActionButton/components/ActionCostTooltip";
import TippyWrapper from "components/TippyWrapper";

interface Props {
  actionCost?: number;
  children?: React.ReactNode;
  disabled: boolean;
  isWorking?: boolean;
  go?: boolean;
  onClick: () => void;
  classNames?: string;
  target?: string;
}

export default function MainButton({
  actionCost,
  children,
  disabled,
  isWorking,
  go,
  onClick,
  classNames,
  target,
}: Props) {
  const hasActionCost = useMemo(
    () => actionCost !== undefined && actionCost !== 1,
    [actionCost]
  );

  const dispatch = useDispatch();

  const doPopUp = useCallback(async () => {
    const newWindow = window.open(target, "_blank", "noopener,noreferrer");

    if (newWindow) {
      newWindow.opener = null;
    }

    await dispatch(goBack());
  }, [dispatch, target]);

  const button = useMemo(() => {
    return (
      <button
        className={classnames(
          "js-tt button button--primary button--margin",
          classNames,
          go && "button--go",
          (isWorking || disabled) && "button--disabled"
        )}
        onClick={target ? doPopUp : onClick}
        disabled={disabled}
        type="button"
      >
        {children}
        {!isWorking && hasActionCost && <ActionCost cost={actionCost!} />}
      </button>
    );
  }, [
    actionCost,
    children,
    classNames,
    disabled,
    doPopUp,
    go,
    hasActionCost,
    isWorking,
    onClick,
    target,
  ]);

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

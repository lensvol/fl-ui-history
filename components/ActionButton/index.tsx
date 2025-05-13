import React, { useCallback } from "react";

import ButtonLabel from "components/ActionButton/components/ButtonLabel";
import FateRefreshButton from "components/ActionButton/components/FateRefreshButton";
import MainButton from "components/ActionButton/components/MainButton";
import ActionRefreshContext from "components/ActionRefreshContext";
import { IActionRefreshContextValues } from "components/ActionRefreshContext/ActionRefreshContext";

import { useAppSelector } from "features/app/store";
import { UI_INTEGRATION_REGEX } from "features/content-behaviour-integration/constants";

export type Props = {
  children?: React.ReactNode;
  data: any;
  disabled?: boolean;
  go?: boolean;
  isWorking?: boolean;
  onClick: () => void;
  suppressUnlockButton?: boolean;
};

export default function ActionButton({
  children,
  data,
  disabled,
  go,
  isWorking,
  onClick,
  suppressUnlockButton,
}: Props) {
  const actions = useAppSelector((state) => state.actions.actions);
  const currentFate = useAppSelector((state) => state.fate.data.currentFate);
  const remainingActionRefreshes = useAppSelector(
    (state) => state.settings.subscriptions.remainingActionRefreshes
  );

  // We're action-locked if this isn't a plot report and we don't have enough actions for this option
  const isActionLocked =
    !(data.isPlotReport ?? false) && data.actionCost > actions;

  const isDisabled =
    (disabled ?? false) ||
    isActionLocked ||
    data.currencyLocked ||
    data.qualityLocked;
  const hasEnoughFate = (currentFate || 0) >= 4;
  const hasActionRefreshes = (remainingActionRefreshes || 0) !== 0;
  const uiTriggerMatches = data.description?.match(UI_INTEGRATION_REGEX);
  const target =
    (uiTriggerMatches?.length ?? 0) > 4 ? uiTriggerMatches?.[4] : undefined;
  const showActionRefresh =
    isActionLocked && !(isWorking ?? false) && !(suppressUnlockButton ?? false);

  const handleClick = useCallback(() => {
    if (isDisabled) {
      return null;
    }

    return onClick();
  }, [isDisabled, onClick]);

  return (
    <>
      <MainButton
        actionCost={data.actionCost}
        disabled={isDisabled}
        isWorking={isWorking}
        go={go}
        onClick={handleClick}
        classNames={data.buttonClassNames}
        target={target}
      >
        <ButtonLabel actions={actions} data={data} isWorking={isWorking}>
          {children}
        </ButtonLabel>
      </MainButton>
      {showActionRefresh && (
        <ActionRefreshContext.Consumer>
          {({
            onOpenActionRefreshModal,
            onOpenPurchaseFateModal,
            onOpenEnhancedRefreshModal,
          }: IActionRefreshContextValues) => (
            <FateRefreshButton
              hasEnoughFate={hasEnoughFate}
              hasActionRefreshes={hasActionRefreshes}
              onOpenActionRefreshModal={onOpenActionRefreshModal}
              onOpenPurchaseFateModal={onOpenPurchaseFateModal}
              onOpenEnhancedRefreshModal={onOpenEnhancedRefreshModal}
              go={go}
            />
          )}
        </ActionRefreshContext.Consumer>
      )}
    </>
  );
}

ActionButton.displayName = "ActionButton";

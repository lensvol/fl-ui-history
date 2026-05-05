import React, { useCallback, useState } from "react";

import ButtonLabel from "components/ActionButton/components/ButtonLabel";
import FateRefreshButton from "components/ActionButton/components/FateRefreshButton";
import MainButton from "components/ActionButton/components/MainButton";
import ActionRefreshContext from "components/ActionRefreshContext";
import { IActionRefreshContextValues } from "components/ActionRefreshContext/ActionRefreshContext";

import { useAppSelector } from "features/app/store";
import {
  UI_BEHAVIOUR_OPEN_NAME_CHANGE,
  UI_BEHAVIOUR_OPEN_SITE,
  UI_INTEGRATION_REGEX, // eslint-disable-line @typescript-eslint/no-unused-vars
} from "features/content-behaviour-integration/constants";
import ChangeNameModal from "components/Myself/ChangeNameModal";

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
  const showActionRefresh =
    isActionLocked && !(isWorking ?? false) && !(suppressUnlockButton ?? false);

  const uiTriggerMatches = data.description?.match(UI_INTEGRATION_REGEX);
  const uiTriggerMatchLength = uiTriggerMatches?.length ?? 0;
  const command = uiTriggerMatchLength > 1 ? uiTriggerMatches[1] : undefined;

  const target =
    command === UI_BEHAVIOUR_OPEN_SITE && uiTriggerMatchLength > 4
      ? uiTriggerMatches[4]
      : undefined;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRequestClose = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleClick = useCallback(() => {
    if (isDisabled) {
      return null;
    }

    if (command === UI_BEHAVIOUR_OPEN_NAME_CHANGE) {
      setIsModalOpen(true);
    }

    return onClick();
  }, [command, isDisabled, onClick]);

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
      <ChangeNameModal
        isFree
        isOpen={isModalOpen}
        onRequestClose={handleRequestClose}
      />
    </>
  );
}

ActionButton.displayName = "ActionButton";

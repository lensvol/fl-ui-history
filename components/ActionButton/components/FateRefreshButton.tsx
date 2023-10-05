import React, { useCallback } from "react";
import { connect } from "react-redux";
import classnames from "classnames";
import TippyWrapper from "components/TippyWrapper";
import FateRefreshTooltip from "./FateRefreshTooltip";

export interface Props {
  dispatch: Function;
  go: boolean | undefined;
  hasEnoughFate?: boolean | undefined;
  hasActionRefreshes: boolean;
  onOpenActionRefreshModal: Function;
  onOpenPurchaseFateModal: Function;
  onOpenEnhancedRefreshModal: Function;
}

function FateRefreshButton({
  go,
  hasEnoughFate,
  hasActionRefreshes,
  onOpenActionRefreshModal,
  onOpenPurchaseFateModal,
  onOpenEnhancedRefreshModal,
}: Props) {
  const handleClick = useCallback(() => {
    if (hasActionRefreshes) {
      return onOpenEnhancedRefreshModal();
    }

    if (hasEnoughFate) {
      return onOpenActionRefreshModal();
    }

    return onOpenPurchaseFateModal();
  }, [
    hasEnoughFate,
    hasActionRefreshes,
    onOpenActionRefreshModal,
    onOpenPurchaseFateModal,
    onOpenEnhancedRefreshModal,
  ]);

  return (
    <TippyWrapper
      content={
        <FateRefreshTooltip
          hasEnoughFate={!!hasEnoughFate}
          hasActionRefreshes={hasActionRefreshes}
        />
      }
    >
      <button
        className={classnames(
          "js-tt button button--margin",
          hasActionRefreshes ? "button--ef" : "button--secondary",
          go && "button--go"
        )}
        onClick={handleClick}
        type="button"
      >
        {hasEnoughFate || hasActionRefreshes ? "Refresh" : "Unlock"}
      </button>
    </TippyWrapper>
  );
}

FateRefreshButton.displayName = "FateRefreshButton";

export default connect()(FateRefreshButton);

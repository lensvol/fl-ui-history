import React, {
  useCallback,
} from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import TippyWrapper from 'components/TippyWrapper';
import FateRefreshTooltip from "./FateRefreshTooltip";

export interface Props {
  dispatch: Function,
  go: boolean | undefined,
  hasEnoughFate?: boolean | undefined,
  onOpenActionRefreshModal: Function,
  onOpenPurchaseFateModal: Function,
}

function FateRefreshButton({
  go,
  hasEnoughFate,
  onOpenActionRefreshModal,
  onOpenPurchaseFateModal,
}: Props) {
  const handleClick = useCallback(() => {
    if (hasEnoughFate) {
      return onOpenActionRefreshModal();
    }
    return onOpenPurchaseFateModal();
  }, [
    hasEnoughFate,
    onOpenActionRefreshModal,
    onOpenPurchaseFateModal,
  ]);

  return (
    <TippyWrapper
      content={<FateRefreshTooltip hasEnoughFate={!!hasEnoughFate} />}
    >
      <button
        className={classnames(
          'js-tt button button--secondary button--margin',
          go && 'button--go',
        )}
        onClick={handleClick}
        type="button"
      >
        {hasEnoughFate ? 'Refresh' : 'Unlock'}
      </button>
    </TippyWrapper>
  );
}
FateRefreshButton.displayName = 'FateRefreshButton';

export default connect()(FateRefreshButton);
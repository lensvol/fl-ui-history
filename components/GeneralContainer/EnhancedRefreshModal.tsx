import React from "react";
import { connect } from "react-redux";

import PurchaseModal from "components/PurchaseModal";

import { IAppState } from "types/app";

export function EnhancedRefreshModal({
  enhancedActionRefreshCard,
  isOpen,
  onRequestClose,
}: Props) {
  return (
    <PurchaseModal
      data={enhancedActionRefreshCard}
      isOpen={isOpen}
      onRequestClose={onRequestClose}
    />
  );
}

const mapStateToProps = (state: IAppState) => ({
  enhancedActionRefreshCard: {
    ...state.fate.data.enhancedActionRefreshCard,
    remainingActionRefreshes:
      state.settings.subscriptions.remainingActionRefreshes ?? 0,
  },
});

type Props = ReturnType<typeof mapStateToProps> & {
  isOpen: boolean;
  onRequestClose: () => void;
};

export default connect(mapStateToProps)(EnhancedRefreshModal);

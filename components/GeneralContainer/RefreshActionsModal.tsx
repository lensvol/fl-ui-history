import React from 'react';
import { connect } from 'react-redux';

import PurchaseModal from 'components/PurchaseModal';
import { IAppState } from 'types/app';

export function RefreshActionsModal({ actionRefillFateCard, isOpen, onRequestClose }: Props) {
  return (
    <PurchaseModal
      data={actionRefillFateCard}
      isOpen={isOpen}
      onRequestClose={onRequestClose}
    />
  );
}

const mapStateToProps = (state: IAppState) => ({
  actionRefillFateCard: state.fate.data.actionRefillFateCard,
});

type Props = ReturnType<typeof mapStateToProps> & {
  isOpen: boolean,
  onRequestClose: () => void,
};

export default connect(mapStateToProps)(RefreshActionsModal);

import React from "react";
import { connect } from "react-redux";
import { IAppState } from "types/app";
import { REFILL_OPPORTUNITY_DECK } from "constants/fate";
import PurchaseModal from "components/PurchaseModal";

export function RefillOpportunityDeckModal({
  fateData,
  isOpen,
  onRequestClose,
}: Props) {
  const data = fateData.fateCards.find(
    ({ action }: { action: string }) => action === REFILL_OPPORTUNITY_DECK
  );

  if (!data) {
    return null;
  }

  return (
    <PurchaseModal
      data={data}
      isOpen={isOpen}
      onRequestClose={onRequestClose}
    />
  );
}

const mapStateToProps = (state: IAppState) => ({
  fateData: state.fate.data,
});

type Props = ReturnType<typeof mapStateToProps> & {
  isOpen: boolean;
  onRequestClose: () => void;
};

export default connect(mapStateToProps)(RefillOpportunityDeckModal);

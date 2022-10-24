import { OUTFIT_PURCHASE } from "constants/fate";
import React, { useCallback, useMemo } from "react";
import { connect } from "react-redux";
import classnames from "classnames";

import { openDialog as openBuyFateDialog } from "actions/payment";
import { ThunkDispatch } from "redux-thunk";
import { IAppState } from "types/app";
import { IFateCard } from "types/fate";
import { OutfitType } from "types/outfit";
import { HUMAN_READABLE_OUTFIT_NAMES, OUTFIT_TYPES } from "constants/outfits";

export function PurchaseOutfitReady({
  currentFate,
  dispatch,
  fateCards,
  maxOutfits,
  onBuyOutfit,
  outfits,
}: Props) {
  const fateCard = useMemo(
    () => fateCards.find((fc) => fc.action === OUTFIT_PURCHASE)!,
    [fateCards]
  );

  const numberOfOutfits = useMemo(() => outfits.length, [outfits]);

  const numberOfPurchasedOutfits = useMemo(
    () => outfits.filter((o) => o.type === "Purchased").length,
    [outfits]
  );

  const numberOfSlotsAvailable = useMemo(
    () => Math.max(0, maxOutfits - numberOfPurchasedOutfits),
    [maxOutfits, numberOfPurchasedOutfits]
  );

  const explanation = useMemo(() => {
    // Map outfit type -> no. of owned outfits
    const aggregate: { [key in OutfitType]: number } = OUTFIT_TYPES.reduce(
      (acc, t) => ({ ...acc, [t]: outfits.filter((o) => o.type === t).length }),
      {} as { [key in OutfitType]: number }
    );

    // Build a list of "n × Foo" strings where n > 0 and return a comma-separated string
    return OUTFIT_TYPES.filter((t) => aggregate[t] > 0)
      .map((t) => `${aggregate[t]} × ${HUMAN_READABLE_OUTFIT_NAMES[t]}`)
      .join(", ");
  }, [outfits]);

  const onSummonFateModal = useCallback(
    () => dispatch(openBuyFateDialog("buy")),
    [dispatch]
  );

  return (
    <>
      <h1 className={classnames("purchase-outfit-slot-modal__header")}>
        Purchase Outfits
      </h1>
      <div className="purchase-outfit-slot-modal__current-outfit-slots">
        <span className="purchase-outfit-slot-modal__rubric">
          Current Outfits:
        </span>
        <span className="purchase-outfit-slot-modal__value">
          {numberOfOutfits}
        </span>
        <span className="purchase-outfit-slot-modal__explanation">
          ({explanation})
        </span>
      </div>
      <div className="purchase-outfit-slot-modal__outfit-slots-available">
        <span className="purchase-outfit-slot-modal__rubric">
          Outfits available for purchase:
        </span>
        <span className="purchase-outfit-slot-modal__value">
          {numberOfSlotsAvailable}
        </span>
      </div>
      {currentFate < fateCard.price && (
        <p className="purchase-outfit-slot-modal__not-enough-fate-rubric">
          Purchasing an outfit costs {fateCard.price} Fate; you have{" "}
          {currentFate}.
        </p>
      )}
      <BuyOutfitOrFateButton
        currentFate={currentFate}
        fateCard={fateCard}
        onBuyOutfit={onBuyOutfit}
        onSummonFateModal={onSummonFateModal}
      />
    </>
  );
}

function BuyOutfitOrFateButton({
  currentFate,
  fateCard,
  onBuyOutfit,
  onSummonFateModal,
}: {
  currentFate: number;
  fateCard: IFateCard;
  onBuyOutfit: () => Promise<void>;
  onSummonFateModal: () => void;
}) {
  if (currentFate >= fateCard.price) {
    return (
      <button
        className="button button--secondary"
        onClick={onBuyOutfit}
        type="button"
      >
        Purchase outfit (20 Fate)
      </button>
    );
  }
  return (
    <button
      className="button button--secondary"
      onClick={onSummonFateModal}
      type="button"
    >
      Buy Fate
    </button>
  );
}

const mapStateToProps = (state: IAppState) => ({
  currentFate: state.fate.data.currentFate,
  fateCards: state.fate.data.fateCards,
  maxOutfits: state.outfit.maxOutfits,
  outfits: state.myself.character.outfits,
});

type Props = ReturnType<typeof mapStateToProps> & {
  dispatch: ThunkDispatch<any, any, any>;
  onBuyOutfit: () => Promise<void>;
};

export default connect(mapStateToProps)(PurchaseOutfitReady);

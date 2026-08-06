import React, { useEffect } from "react";

import { useDispatch } from "react-redux";

import { fetch as fetchCards } from "actions/cards";

import Deck from "components/Cards/components/Deck";
import Hand from "components/Cards/components/Hand";
import DeckRefreshContext from "components/DeckRefreshContext";

import { useAppSelector } from "features/app/store";

export default function Cards() {
  const showOps = useAppSelector((state) => state.map.showOps);
  const wasInvalidatedByEquipmentChange = useAppSelector(
    (state) => state.cards.wasInvalidatedByEquipmentChange
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (wasInvalidatedByEquipmentChange) {
      dispatch(fetchCards());
    }
  }, [dispatch, wasInvalidatedByEquipmentChange]);

  if (!showOps) {
    return null;
  }

  return (
    <div className="cards">
      <DeckRefreshContext.Consumer>
        {(value) => (
          <Deck onOpenDeckRefreshModal={value.onOpenDeckRefreshModal} />
        )}
      </DeckRefreshContext.Consumer>
      <Hand />
    </div>
  );
}

Cards.displayName = "Cards";

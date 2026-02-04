import React, { useCallback, useMemo, useState } from "react";
import { useDispatch } from "react-redux";

import { discard, shouldFetch } from "actions/cards";
import { begin } from "actions/storylet";

import Card from "components/Cards/components/CardContainer/Card";
import DiscardButton from "components/Cards/components/CardContainer/DiscardButton";
import LockedCardModal from "components/Cards/components/LockedCardModal";

import { useAppSelector } from "features/app/store";

import { ICard } from "types/cards";

type Props = {
  data: ICard;
};

export default function CardContainer({ data }: Props) {
  const disabled = useAppSelector(
    (state) => state.storylet.isChoosing || state.cards.isFetching
  );
  const dispatch = useDispatch();

  const { eventId, isAutofire, stickiness } = data;

  const isLocked = data.qualityRequirements.some(
    (qreq) => qreq.status === "Locked"
  );
  const [isLockedReasonOpen, setIsLockedReasonOpen] = useState(false);

  const onRequestClose = useCallback(() => {
    setIsLockedReasonOpen(false);
  }, []);

  const discardCard = useCallback(() => {
    // If we are already doing some API work, then don't do anything
    if (disabled) {
      return;
    }

    dispatch(discard(eventId));
  }, [disabled, dispatch, eventId]);

  const playCard = useCallback(() => {
    // If we are already doing some API work, then don't do anything
    if (disabled) {
      return;
    }

    if (isLocked) {
      setIsLockedReasonOpen(true);

      return;
    }

    if (isAutofire) {
      dispatch(shouldFetch());
    }

    dispatch(begin(eventId));
  }, [disabled, dispatch, eventId, isAutofire, isLocked]);

  const isDiscardable = useMemo(() => {
    return stickiness !== "Sticky";
  }, [stickiness]);

  return (
    <>
      <div className="hand__card-container" data-event-id={eventId}>
        <Card data={data} onClick={playCard} />
        {isDiscardable && (
          <DiscardButton disabled={disabled} onClick={discardCard} />
        )}
      </div>

      <LockedCardModal
        card={data}
        isOpen={isLockedReasonOpen}
        onRequestClose={onRequestClose}
      />
    </>
  );
}

CardContainer.displayName = "CardContainer";

import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";

import classnames from "classnames";

import { discard as discardCard, shouldFetch } from "actions/cards";
import { begin } from "actions/storylet";

import Buttonlet from "components/Buttonlet";
import LockedCardModal from "components/Cards/components/LockedCardModal";
import SmallCard from "components/Cards/components/SmallCardContainer/SmallCard";
import makeTooltipData from "components/Cards/utils/makeTooltipData";
import Loading from "components/Loading";

import { useAppSelector } from "features/app/store";

import useIsMounted from "hooks/useIsMounted";

import { ICard } from "types/cards";

type Props = {
  data: ICard;
};

export default function SmallCardContainer({ data }: Props) {
  const isChoosing = useAppSelector((state) => state.storylet.isChoosing);
  const isFetching = useAppSelector((state) => state.cards.isFetching);

  const { eventId, isAutofire, name, stickiness, teaser } = data;

  const { ...tooltipData } = data;

  const dispatch = useDispatch();
  const isMounted = useIsMounted();

  const [isWorking, setIsWorking] = useState(false);

  const discard = useCallback(() => {
    dispatch(discardCard(eventId));
  }, [dispatch, eventId]);

  const isLocked = data.qualityRequirements.some(
    (qreq) => qreq.status === "Locked"
  );
  const [isLockedReasonOpen, setIsLockedReasonOpen] = useState(false);

  const onRequestClose = useCallback(() => {
    setIsLockedReasonOpen(false);
  }, []);

  const play = useCallback(async () => {
    if (isLocked) {
      setIsLockedReasonOpen(true);

      return;
    }

    setIsWorking(true);

    if (isAutofire) {
      dispatch(shouldFetch());
    }

    await dispatch(begin(eventId));

    if (isMounted.current) {
      setIsWorking(false);
    }
  }, [dispatch, eventId, isAutofire, isLocked, isMounted]);

  const lockedByOtherCard = isChoosing && !isWorking;

  return (
    <>
      <div
        className={classnames(
          "branch small-card-container",
          isFetching && "card--fetching",
          lockedByOtherCard && "storylet--semi-transparent"
        )}
        data-event-id={eventId}
      >
        <div className="media__left small-card__left">
          <SmallCard
            cardData={data}
            tooltipData={makeTooltipData({
              action: play,
              data: {
                ...tooltipData,
                smallButtons: isLocked
                  ? [
                      {
                        action: play,
                        label: "requirements",
                      },
                    ]
                  : undefined,
              },
            })}
          />
        </div>
        <div className="media__body small-card__body">
          <div className="small-card__title-and-buttonlet">
            {stickiness !== "Sticky" && (
              <div className="branch__plan-buttonlet">
                <Buttonlet
                  type="delete"
                  onClick={discard}
                  disabled={isFetching}
                />
              </div>
            )}
            <h2
              className="media__heading heading heading--3"
              dangerouslySetInnerHTML={{ __html: name }}
            />
          </div>
          <div
            className="small-card__teaser"
            dangerouslySetInnerHTML={{ __html: teaser }}
          />
          <div className="buttons">
            <button
              className={classnames(
                "button button--primary button--margin",
                lockedByOtherCard && "button--disabled"
              )}
              onClick={play}
              type="button"
            >
              {isWorking && <Loading spinner small />}
              {!isWorking && isLocked && "Requirements"}
              {!isWorking && !isLocked && "Play"}
            </button>
          </div>
        </div>
      </div>

      <LockedCardModal
        card={data}
        isOpen={isLockedReasonOpen}
        onRequestClose={onRequestClose}
      />
    </>
  );
}

SmallCardContainer.displayName = "SmallCardContainer";

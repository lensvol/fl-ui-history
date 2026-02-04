import React from "react";

import classnames from "classnames";

import LockedSlotIcon from "components/Equipment/LockedSlotIcon";
import Image from "components/Image";
import { ITooltipData } from "components/ModalTooltip/types";
import TippyWrapper from "components/TippyWrapper";

import { useAppSelector } from "features/app/store";

import { ICard } from "types/cards";

import getBorderColour from "utils/getBorderColour";

type Props = {
  cardData: ICard;
  tooltipData: ITooltipData;
};

export default function SmallCard({ cardData, tooltipData }: Props) {
  const borderColour = getBorderColour(cardData);
  const isFetching = useAppSelector((state) => state.cards.isFetching);
  const isLocked = cardData.qualityRequirements.some(
    (qreq) => qreq.status === "Locked"
  );

  return (
    <TippyWrapper tooltipData={tooltipData}>
      <div
        className={classnames(
          "card storylet__card",
          isFetching && "card--fetching"
        )}
        style={{
          position: "sticky",
        }}
      >
        <Image
          alt={cardData.name}
          border={borderColour}
          borderContainerClassName={classnames(
            "small-card__border",
            isLocked && "icon--locked"
          )}
          className={classnames(
            "small-card__image",
            isLocked && "icon--locked"
          )}
          icon={cardData.image}
          interactiveProps={{
            focus: {
              outline: "solid 2px #1d1d1d",
            },
          }}
          tooltipData={tooltipData}
          type="icon"
        />
        {isLocked && <LockedSlotIcon classNames="hand__card--lock" />}
      </div>
    </TippyWrapper>
  );
}

SmallCard.displayName = "SmallCard";

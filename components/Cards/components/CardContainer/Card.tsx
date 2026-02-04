import React, { useMemo } from "react";

import classnames from "classnames";

import makeTooltipData from "components/Cards/utils/makeTooltipData";
import LockedSlotIcon from "components/Equipment/LockedSlotIcon";
import Image from "components/Image";
import TippyWrapper from "components/TippyWrapper";

import { useAppSelector } from "features/app/store";

import { ICard } from "types/cards";

import getBorderColour from "utils/getBorderColour";

interface Props {
  data: ICard;
  onClick: () => void;
}

export default function Card({ data, onClick }: Props) {
  const { isAutofire, teaser } = data;

  const isFetching = useAppSelector((state) => state.cards.isFetching);
  const borderColour = getBorderColour(data);

  const teaserWithAutofireWarning = useMemo(() => {
    if (isAutofire) {
      return `${teaser}<p class='u-visually-hidden'>This card will take effect as soon as you click it.</p>`;
    }

    return teaser;
  }, [isAutofire, teaser]);

  const tooltipData = makeTooltipData({
    action: onClick,
    data: {
      ...data,
      teaser: teaserWithAutofireWarning,
    },
  });

  const isLocked = data.qualityRequirements.some(
    (qreq) => qreq.status === "Locked"
  );

  return (
    <TippyWrapper tooltipData={tooltipData}>
      <div className={classnames("hand__card", isFetching && "card--fetching")}>
        <Image
          alt={data.name}
          border={borderColour}
          borderContainerClassName={classnames(
            "hand__border",
            isLocked && "icon--locked"
          )}
          className={classnames("hand__image", isLocked && "icon--locked")}
          icon={data.image}
          interactiveProps={{
            focus: {
              outline: "solid 2px #1d1d1d",
            },
          }}
          onClick={onClick}
          tooltipData={tooltipData}
          type="icon"
        />
        {isLocked && <LockedSlotIcon classNames="hand__card--lock" />}
      </div>
    </TippyWrapper>
  );
}

Card.displayName = "Card";

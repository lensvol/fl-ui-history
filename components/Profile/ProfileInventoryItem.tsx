import classnames from "classnames";
import Image from "components/Image";

import React, { Fragment, SyntheticEvent, useCallback } from "react";
import Interactive, { ClickType } from "react-interactive";
import { useDispatch } from "react-redux";

import { openModalTooltip } from "actions/modalTooltip";

import TippyWrapper from "components/TippyWrapper";

import { IQuality } from "types/qualities";

interface Props {
  isLarge?: boolean;
  possession?: IQuality;
  slotCategory: string;
  slotDescription: string;
}

export default function ProfileInventoryItem({
  isLarge,
  possession,
  slotCategory,
  slotDescription,
}: Props) {
  const tooltipData = {
    ...possession,
    description: possession
      ? `<p>${possession.description}</p>
        ${possession.availableAt ? `<p class="tooltip__available-at">${possession.availableAt}</p>` : ""}`
      : undefined,
    level: undefined,
    levelDescription: undefined, // Don't let the tooltip override the quality name
    name: `${slotCategory}${possession ? ` &ndash; ${possession?.name}` : ""}`,
    secondaryDescription: possession ? undefined : slotDescription,
  };

  const imageClass = classnames(
    isLarge
      ? "profile__inventory-item-image-large"
      : "profile__inventory-item-image"
  );

  const dispatch = useDispatch();

  const onClickEmptySlot = useCallback(
    (_evt: SyntheticEvent, clickType: ClickType) => {
      // If we received a mouse click, then do nothing
      if (clickType === "mouseClick") {
        return;
      }

      // Otherwise, this was a tap event (or similar) that requires us to show
      // the info tooltip
      dispatch(openModalTooltip(tooltipData));
    },
    [dispatch, tooltipData]
  );

  return (
    <Fragment>
      <div
        data-quality-id={possession?.id}
        className={classnames(
          isLarge ? "profile__inventory-item-large" : "profile__inventory-item"
        )}
      >
        {possession ? (
          <Image
            className={imageClass}
            icon={possession.image ?? "black"}
            alt={possession.name}
            type={isLarge ? "icon" : "small-icon"}
            tooltipData={tooltipData}
            defaultCursor
          />
        ) : (
          <Interactive
            as="div"
            aria-label={slotCategory}
            onClick={onClickEmptySlot}
            style={{
              alignSelf: "start",
              cursor: "default",
            }}
          >
            <TippyWrapper tooltipData={tooltipData}>
              <div
                aria-label={slotCategory}
                className={classnames("cursor-default", imageClass)}
              />
            </TippyWrapper>
          </Interactive>
        )}
      </div>
    </Fragment>
  );
}

ProfileInventoryItem.displayName = "ProfileInventoryItem";

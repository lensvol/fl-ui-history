import React from "react";

import classnames from "classnames";

import Image from "components/Image";
import { ITooltipData } from "components/ModalTooltip/types";
import MediaMdUp from "components/Responsive/MediaMdUp";

import { IQuality } from "types/qualities";

import shouldRenderQualityName from "utils/shouldRenderQualityName";

type Props = IQuality & {
  isChanging: boolean;
  onClick: () => any;
  tooltipData: ITooltipData;
};

export default function DisplayQualityMdUp({
  effectiveLevel,
  isChanging,
  image,
  name,
  nameAndLevel,
  nature,
  onClick,
  tooltipData,
}: Props) {
  const shouldRenderNameAndLevel = shouldRenderQualityName(nameAndLevel);

  return (
    <MediaMdUp>
      <div
        className={classnames(
          "display-quality__image-and-name",
          isChanging && "display-quality--is-changing"
        )}
      >
        <div
          className={classnames(
            "icon",
            nature === "Status" && "icon--circular",
            "display-quality__image"
          )}
        >
          <Image
            icon={image}
            alt={name}
            type="small-icon"
            onClick={onClick}
            tooltipData={tooltipData}
          />
          <span className="icon__value">
            {effectiveLevel.toLocaleString("en-GB")}
          </span>
        </div>
        <div>
          <span className="js-item-name item__name">
            {shouldRenderNameAndLevel ? (
              <span dangerouslySetInnerHTML={{ __html: nameAndLevel }} />
            ) : (
              nameAndLevel
            )}
          </span>
        </div>
      </div>
    </MediaMdUp>
  );
}

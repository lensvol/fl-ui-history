import React from "react";

import classnames from "classnames";

import Image from "components/Image";
import { ITooltipData } from "components/ModalTooltip/types";
import MediaSmDown from "components/Responsive/MediaSmDown";

import { IQuality } from "types/qualities";

import shouldRenderQualityName from "utils/shouldRenderQualityName";

type Props = IQuality & {
  isChanging: boolean;
  onClick: () => any;
  tooltipData: ITooltipData;
};

export default function DisplayQualitySmDown({
  image,
  isChanging,
  name,
  nameAndLevel,
  nature,
  onClick,
  tooltipData,
}: Props) {
  const shouldRenderNameAndLevel = shouldRenderQualityName(nameAndLevel);

  return (
    <MediaSmDown>
      <li
        className={classnames(
          "js-item item",
          isChanging && "display-quality--is-changing"
        )}
      >
        <div
          className={classnames(
            "icon display-quality__image",
            nature === "Status" && "icon--circular"
          )}
        >
          <Image
            alt={name}
            icon={image}
            onClick={onClick}
            type="small-icon"
            tooltipData={tooltipData}
          />
        </div>
        <div className="item__desc">
          <span className="js-item-name item__name">
            {shouldRenderNameAndLevel ? (
              <span dangerouslySetInnerHTML={{ __html: nameAndLevel }} />
            ) : (
              nameAndLevel
            )}
          </span>
        </div>
      </li>
    </MediaSmDown>
  );
}

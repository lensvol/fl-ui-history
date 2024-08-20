import React from "react";
import classnames from "classnames";

import Image from "components/Image";

import { IQuality } from "types/qualities";
import { ITooltipData } from "components/ModalTooltip/types";
import getModifier from "./getModifier";

const MENACE = "Menace";

interface Props extends IQuality {
  tooltipData: ITooltipData;
}

export default function SidebarQuality({
  category,
  image,
  effectiveLevel,
  level,
  name,
  progressAsPercentage,
  tooltipData,
}: Props) {
  const modifier = getModifier({ effectiveLevel, level });

  return (
    <li className="js-item item sidebar-quality">
      <div className="js-icon icon js-tt icon--circular">
        <Image
          defaultCursor
          alt={name}
          icon={image}
          type="small-icon"
          tooltipData={tooltipData}
          tooltipPos="right"
        />
      </div>
      <div className="item__desc">
        <span className="js-item-name item__name">{name}</span>{" "}
        <span className="item__value">{level.toLocaleString("en-GB")}</span>
        {modifier && <span className="item__adjust">{modifier}</span>}
        {progressAsPercentage >= 0 && (
          <>
            <div
              className={classnames(
                "progress-bar",
                category === MENACE && "progress-bar--menace"
              )}
            >
              <span
                className={classnames(
                  "progress-bar__stripe progress-bar__stripe--has-transition",
                  category === MENACE && "progress-bar__stripe--menace"
                )}
                style={{ width: `${Number(progressAsPercentage) || 0}%` }}
              />
            </div>
          </>
        )}
      </div>
    </li>
  );
}

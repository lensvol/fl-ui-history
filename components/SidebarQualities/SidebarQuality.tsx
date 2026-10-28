import React, { useEffect, useState } from "react";

import classnames from "classnames";

import { clearChangeType } from "actions/myself";

import Image from "components/Image";
import { ITooltipData } from "components/ModalTooltip/types";
import getModifier from "components/SidebarQualities/getModifier";

import { IQuality } from "types/qualities";

const MENACE = "Menace";

interface Props extends IQuality {
  tooltipData: ITooltipData;
}

export default function SidebarQuality({
  category,
  changeType,
  effectiveLevel,
  id,
  image,
  level,
  name,
  previousProgress,
  progressAsPercentage,
  tooltipData,
}: Props) {
  const modifier = getModifier({
    effectiveLevel,
    level,
  });

  const [currentPercent, setCurrentPercent] = useState(
    previousProgress?.percentage ?? progressAsPercentage
  );

  useEffect(() => {
    if (
      progressAsPercentage < 0 || // no progress bar
      previousProgress === undefined || // missing data
      changeType === undefined || // missing data
      changeType === "Lost" || // 'Lost' doesn't animate because SidebarQuality is removed entirely
      currentPercent === progressAsPercentage // this bar doesn't need to move
    ) {
      return;
    }

    const isIncreasing =
      changeType === "Gained" ||
      changeType === "Increased" ||
      (changeType === "Unaltered" && currentPercent < progressAsPercentage);

    const durationInMillis = 2 * 1000;
    const intervalInMillis = 10;
    const widthIncrement = (100 / durationInMillis) * intervalInMillis;

    const timer = setTimeout(() => {
      if (currentPercent === progressAsPercentage) {
        clearChangeType(id);

        return;
      }

      if (isIncreasing) {
        if (currentPercent >= 100) {
          setCurrentPercent(0);
        } else {
          setCurrentPercent(currentPercent + widthIncrement);
        }
      } else {
        if (currentPercent <= 0) {
          setCurrentPercent(100);
        } else {
          setCurrentPercent(currentPercent - widthIncrement);
        }
      }
    }, intervalInMillis);

    return () => clearTimeout(timer); // Cleanup the timer
  }, [
    changeType,
    currentPercent,
    id,
    level,
    previousProgress,
    progressAsPercentage,
  ]);

  return (
    <li className="js-item item sidebar-quality">
      <div className="js-icon icon js-tt icon--circular">
        <Image
          alt={name}
          defaultCursor
          icon={image}
          tooltipData={tooltipData}
          tooltipPos="right"
          type="small-icon"
        />
      </div>

      <div className="item__desc">
        <span className="js-item-name item__name">{name}</span>{" "}
        <span className="item__value">{level.toLocaleString("en-GB")}</span>
        {modifier && <span className="item__adjust">{modifier}</span>}
        {progressAsPercentage >= 0 && (
          <div
            className={classnames(
              "progress-bar",
              category === MENACE && "progress-bar--menace"
            )}
          >
            <span
              className={classnames(
                "progress-bar__stripe",
                category === MENACE && "progress-bar__stripe--menace"
              )}
              style={{
                width: `${Number(currentPercent) || 0}%`,
              }}
            />
          </div>
        )}
      </div>
    </li>
  );
}

SidebarQuality.displayName = "SidebarQuality";

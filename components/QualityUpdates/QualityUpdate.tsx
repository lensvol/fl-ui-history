import React, { useMemo } from "react";

import classnames from "classnames";

import Image from "components/Image";
import ProgressBar from "components/QualityUpdates/ProgressBar";

import { ApiResultMessageQualityEffect } from "types/app/messages";

type Props = {
  data: ApiResultMessageQualityEffect;
};

export default function QualityUpdate({ data }: Props) {
  const { image, message, possession, progressBar, tooltip } = data;

  const bar = useMemo(() => {
    if (!progressBar) {
      return null;
    }

    const { endPercentage, leftScore, rightScore, startPercentage, type } =
      progressBar;

    const category = possession === undefined ? undefined : possession.category;

    return (
      <ProgressBar
        after={rightScore}
        before={leftScore}
        category={category}
        end={endPercentage}
        start={startPercentage}
        type={type}
      />
    );
  }, [possession, progressBar]);

  const isWorldQuality = possession?.allowedOn === "World";

  const tooltipData = {
    description: tooltip,
    image,
    needsWorldQualityDescription: isWorldQuality,
  };

  const classes = classnames({
    icon: true,
    "icon--circular": possession?.nature === "Status" && !isWorldQuality,
    "icon--world-quality": isWorldQuality,
  });

  return (
    <div className="quality-update">
      <div className="quality-update__left">
        <div className={classes}>
          <Image
            alt={possession?.name}
            className="media__object"
            defaultCursor
            icon={image}
            height={40}
            tooltipData={tooltipData}
            type="small-icon"
            width={40}
          />
        </div>
      </div>

      <div className="quality-update__body">
        {message !== undefined && (
          <div dangerouslySetInnerHTML={{ __html: message }} />
        )}
        {bar}
      </div>
    </div>
  );
}

QualityUpdate.displayName = "QualityUpdate";

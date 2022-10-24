import React, { useMemo } from "react";
import classnames from "classnames";

import Image from "components/Image";
import { ApiResultMessageQualityEffect } from "types/app/messages";
import ProgressBar from "./ProgressBar";

type Props = { data: ApiResultMessageQualityEffect };

export default function QualityUpdate(props: Props) {
  const {
    data: { image, possession, progressBar, message, tooltip },
  } = props;

  const bar = useMemo(() => {
    if (!progressBar) {
      return null;
    }
    const { endPercentage, leftScore, rightScore, startPercentage, type } =
      progressBar;
    return (
      <ProgressBar
        before={leftScore}
        category={possession?.category}
        after={rightScore}
        start={startPercentage}
        end={endPercentage}
        type={type}
      />
    );
  }, [possession, progressBar]);

  const isWorldQuality = possession?.allowedOn === "World";

  const tooltipData = {
    image,
    description: tooltip,
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
            className="media__object"
            icon={image}
            alt={possession?.name}
            width={40}
            height={40}
            type="small-icon"
            tooltipData={tooltipData}
            defaultCursor
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

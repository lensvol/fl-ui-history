import React, { useMemo } from "react";
import classnames from "classnames";

import Image from "components/Image";
import {
  ALLOWED_ON_WORLD,
  HIDDEN_CATEGORIES,
} from "constants/qualityRequirements";
import { stripHtml } from "utils/stringFunctions";
import { ApiQualityRequirement } from "types/storylet";

interface Props {
  data: ApiQualityRequirement;
  storylet?: boolean;
  type?: string;
  tooltipPos?: string;
}

export default function QualityRequirement(props: Props) {
  const { data, storylet, tooltipPos, type } = props;

  const {
    availableAtMessage,
    category,
    image,
    nature,
    status,
    tooltip,
    bonuses,
  } = data;

  const isExcluded = useMemo(
    () => category !== undefined && HIDDEN_CATEGORIES.indexOf(category) >= 0,
    [category]
  );

  const isWorldQuality = useMemo(
    () => data.allowedOn === ALLOWED_ON_WORLD,
    [data]
  );

  const qreqClass = classnames({
    icon: true,
    "icon--circular": nature === "Status" && !isWorldQuality,
    "icon--world-quality": isWorldQuality,
    "icon--locked": status === "Locked",
    "icon--purchase": type === "purchase",
    "quality-requirement": true,
    "quality-requirement--storylet": storylet,
  });

  const tooltipData = {
    ...data,
    description: tooltip,
    // If the player doesn't meet the qreq, then add the AvailableAt as a secondary description
    secondaryDescription:
      status === "Locked" && !isWorldQuality ? availableAtMessage : undefined,
    needsWorldQualityDescription: isWorldQuality,
  };

  if (isExcluded) {
    return null;
  }

  return (
    <>
      {bonuses &&
        bonuses.reverse().map((b) => (
          <>
            <div className={qreqClass}>
              <Image
                icon={b.image}
                alt={
                  b.description === undefined ? "" : stripHtml(b.description)
                }
                type="small-icon"
                tooltipData={{
                  description: b.description,
                }}
                tooltipPos={tooltipPos}
                defaultCursor
              />
            </div>
          </>
        ))}
      <div className={qreqClass}>
        <Image
          icon={image}
          alt={tooltip === undefined ? "" : stripHtml(tooltip)}
          type="small-icon"
          tooltipData={tooltipData}
          tooltipPos={tooltipPos}
          defaultCursor
        />
      </div>
    </>
  );
}

QualityRequirement.displayName = "QualityRequirementContainer";

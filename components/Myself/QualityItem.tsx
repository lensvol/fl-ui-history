import React, { useMemo } from "react";
import Image from "components/Image";
import getImagePath from "utils/getImagePath";
import { OPTIMIZE_MYSELF_QUALITIES } from "features/feature-flags";
import { useFeature } from "flagged";

import { normalize } from "utils/stringFunctions";
import { IQuality } from "types/qualities";

import QualityItemNameAndDescription from "./QualityItemNameAndDescription";

type Props = IQuality & {
  filterString?: string;
};

export default function QualityItem(props: Props) {
  const {
    availableAt,
    effectiveLevel,
    filterString,
    description,
    id,
    image,
    nameAndLevel,
    name,
    relationshipDescription,
  } = props;

  // Should we just render an <img />, or an <Image /> ?
  const usesQualityItemOptimization = useFeature(OPTIMIZE_MYSELF_QUALITIES);

  const tooltipData = useMemo(
    () => ({
      ...props,
      level: effectiveLevel,
      secondaryDescription: availableAt,
    }),
    [availableAt, effectiveLevel, props]
  );

  if (filterString && normalize(name).indexOf(normalize(filterString)) < 0) {
    return null;
  }

  if (usesQualityItemOptimization) {
    return (
      <li className="quality-item">
        <div
          className="icon icon--circular quality-item__icon"
          data-branch-id={id}
        >
          <img
            alt={name}
            className="media__object"
            src={getImagePath({ icon: image, type: "small-icon" })}
          />
        </div>
        <QualityItemNameAndDescription
          description={description}
          nameAndLevel={nameAndLevel}
          relationshipDescription={relationshipDescription}
        />
      </li>
    );
  }

  return (
    <li className="quality-item">
      <div
        className="icon icon--circular quality-item__icon"
        data-branch-id={id}
      >
        <Image
          defaultCursor
          className="media__object"
          icon={image}
          alt={name}
          type="small-icon"
          tooltipData={tooltipData}
          tooltipPos="right"
        />
      </div>
      <QualityItemNameAndDescription
        description={description}
        nameAndLevel={nameAndLevel}
        relationshipDescription={relationshipDescription}
      />
    </li>
  );
}
QualityItem.displayName = "QualityItem";

import React from "react";

import EnhancementDescription from "components/Tooltip/EnhancementDescription";
import LevelDescription from "components/Tooltip/LevelDescription";
import WorldQualityDescription from "components/Tooltip/WorldQualityDescription";

import { IEnhancement } from "types/qualities";

interface Props {
  description?: string;
  enhancements?: IEnhancement[];
  level?: number;
  levelDescription?: string;
  name?: string;
  secondaryDescription?: string;
  needsWorldQualityDescription?: boolean;
}

export default function TooltipDescription(props: Props) {
  const {
    description,
    enhancements,
    needsWorldQualityDescription,
    secondaryDescription,
  } = props;

  return (
    <>
      <LevelDescription {...props} />
      <p>
        <span dangerouslySetInnerHTML={{ __html: description ?? "" }} />
        {(enhancements?.length ?? 0) > 0 && (
          <EnhancementDescription enhancements={enhancements} />
        )}
      </p>
      <div
        className="tooltip__secondary-description"
        dangerouslySetInnerHTML={{ __html: secondaryDescription ?? "" }}
      />
      {needsWorldQualityDescription && <WorldQualityDescription />}
    </>
  );
}

TooltipDescription.displayName = "TooltipDescription";

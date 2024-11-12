import React, { useCallback, useState } from "react";

import classnames from "classnames";

import QualityItemExpansionToggle from "components/Myself/QualityItemExpansionToggle";

import { IQuality } from "types/qualities";

import shouldRenderQualityName from "utils/shouldRenderQualityName";

type Props = Pick<
  IQuality,
  "description" | "relationshipDescription" | "nameAndLevel"
>;

export default function QualityItemNameAndDescription({
  description,
  nameAndLevel,
  relationshipDescription,
}: Props) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = useCallback(() => setExpanded(!expanded), [expanded]);

  const shouldRenderNameAndLevel = shouldRenderQualityName(nameAndLevel);

  return (
    <div className="quality-item__body">
      <span
        className={classnames(
          "js-item-name item__name quality-item__name",
          !!relationshipDescription && "item__name--has-expansion"
        )}
      >
        {shouldRenderNameAndLevel ? (
          <span dangerouslySetInnerHTML={{ __html: nameAndLevel }} />
        ) : (
          nameAndLevel
        )}
        {relationshipDescription && (
          <QualityItemExpansionToggle
            expanded={expanded}
            onClick={toggleExpanded}
          />
        )}
      </span>

      <p
        className="quality-item__description"
        dangerouslySetInnerHTML={{ __html: description }}
      />
      {relationshipDescription && expanded && (
        <div dangerouslySetInnerHTML={{ __html: relationshipDescription }} />
      )}
    </div>
  );
}

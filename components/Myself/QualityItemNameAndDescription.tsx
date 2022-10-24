import React, { useCallback, useState } from "react";
import classnames from "classnames";
import { IQuality } from "types/qualities";
import QualityItemExpansionToggle from "./QualityItemExpansionToggle";

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

  return (
    <div className="quality-item__body">
      <span
        className={classnames(
          "js-item-name item__name quality-item__name",
          !!relationshipDescription && "item__name--has-expansion"
        )}
      >
        {nameAndLevel}
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

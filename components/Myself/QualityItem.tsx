import React from "react";

import QualityItemNameAndDescription from "components/Myself/QualityItemNameAndDescription";

import { IQuality } from "types/qualities";

import getImagePath from "utils/getImagePath";
import { normalize } from "utils/stringFunctions";

type Props = IQuality & {
  filterString?: string;
};

export default function QualityItem(props: Props) {
  const {
    filterString,
    description,
    id,
    image,
    nameAndLevel,
    name,
    relationshipDescription,
  } = props;

  if (filterString && normalize(name).indexOf(normalize(filterString)) < 0) {
    return null;
  }

  return (
    <li className="quality-item">
      <div
        className="icon icon--circular quality-item__icon"
        data-branch-id={id}
      >
        <img
          alt={name}
          className="media__object"
          src={getImagePath({
            icon: image,
            type: "small-icon",
          })}
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

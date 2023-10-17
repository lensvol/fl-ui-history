import classnames from "classnames";
import Image from "components/Image";

import React, { Fragment } from "react";

import { IQuality } from "types/qualities";

export default function ProfileInventoryItem({
  possession,
}: {
  possession: IQuality;
}) {
  const { availableAt, description, id, image, name } = possession;

  const tooltipData = {
    ...possession,
    description: `
        <p>${description}</p>
        ${
          possession.availableAt
            ? `<p class="tooltip__available-at">${availableAt}</p>`
            : ""
        }
      `,
    level: undefined,
    levelDescription: undefined, // Don't let the tooltip override the quality name
  };

  return (
    <Fragment>
      <li
        data-quality-id={id}
        className={classnames("profile__inventory-item")}
      >
        <Image
          className="profile__inventory-item-image"
          icon={image}
          alt={name}
          type="small-icon"
          tooltipData={tooltipData}
          defaultCursor
        />
      </li>
    </Fragment>
  );
}

ProfileInventoryItem.displayName = "ProfileInventoryItem";

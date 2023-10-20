import classnames from "classnames";
import Image from "components/Image";

import React, { Fragment } from "react";

import { IQuality } from "types/qualities";

interface Props {
  isLarge?: boolean;
  possession?: IQuality;
}

export default function ProfileInventoryItem({ isLarge, possession }: Props) {
  const tooltipData = {
    ...possession,
    description: `
        <p>${possession?.description}</p>
        ${
          possession?.availableAt
            ? `<p class="tooltip__available-at">${possession?.availableAt}</p>`
            : ""
        }
      `,
    level: undefined,
    levelDescription: undefined, // Don't let the tooltip override the quality name
  };

  return (
    <Fragment>
      <div
        data-quality-id={possession?.id}
        className={classnames(
          isLarge ? "profile__inventory-item-large" : "profile__inventory-item"
        )}
      >
        <Image
          className={classnames(
            isLarge
              ? "profile__inventory-item-image-large"
              : "profile__inventory-item-image"
          )}
          icon={possession?.image ?? "black"}
          alt={possession?.name}
          type={isLarge ? "icon" : "small-icon"}
          tooltipData={possession !== undefined ? tooltipData : undefined}
          defaultCursor
        />
      </div>
    </Fragment>
  );
}

ProfileInventoryItem.displayName = "ProfileInventoryItem";

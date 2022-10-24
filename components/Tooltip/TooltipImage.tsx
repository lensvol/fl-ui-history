import React from "react";
import classnames from "classnames";

import getImagePath from "utils/getImagePath";

interface Props {
  image: string;
}

export default function TooltipImage({ image }: Props) {
  return (
    <div
      className={classnames(
        image === "actions" && "icon--currency",
        "icon tooltip__icon"
      )}
    >
      <img
        src={getImagePath({ icon: image, type: "small-icon" })}
        alt={image}
      />
    </div>
  );
}

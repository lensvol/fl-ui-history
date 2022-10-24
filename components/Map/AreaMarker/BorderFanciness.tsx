import React from "react";
import classnames from "classnames";
import { SELECTED_LABEL_FILTER_STRING } from "components/Map/AreaMarker/constants";
import getImagePath from "utils/getImagePath";

interface Props {
  side: "top" | "bottom";
  visible: boolean;
  selected?: boolean;
}

export default function BorderFanciness({
  side,
  visible,
  selected = false,
}: Props) {
  return (
    <img
      alt=""
      src={getImagePath({
        icon: `border-fanciness-${side}`,
        type: "map-area-decoration",
      })}
      className={classnames(
        "map__border-fanciness",
        selected && "map__border-fanciness--selected",
        visible && "map__border-fanciness--visible"
      )}
      style={{
        filter: selected ? SELECTED_LABEL_FILTER_STRING : undefined,
      }}
    />
  );
}

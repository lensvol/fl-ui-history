import React, { useEffect, useMemo, useState } from "react";

import classNames from "classnames";

import {
  MAP_BASE_URL,
  MAP_ROOT_AREA_THE_UNTERZEE_V2,
} from "features/mapping/constants";
import { getPrefixForSetting } from "features/mapping/getSpriteSheetFilenamesForSetting";

import { IArea, IMappableSetting, ISetting } from "types/map";

type Props = {
  area: IArea;
  setting?: ISetting;
};

export default function HeaderImage({ area, setting }: Props) {
  const [width, setWidth] = useState<number | undefined>(undefined);
  const [height, setHeight] = useState<number | undefined>(undefined);

  const imageUrl = useMemo(() => {
    const mapRootAreaKey = setting?.mapRootArea?.areaKey;

    const path =
      mapRootAreaKey === undefined ||
      mapRootAreaKey === MAP_ROOT_AREA_THE_UNTERZEE_V2
        ? "fallback/unterzeev2"
        : getPrefixForSetting(setting as IMappableSetting);

    return `${MAP_BASE_URL}/${path}/${area.areaKey}-header.png`;
  }, [area, setting]);

  useEffect(() => {
    if (area === undefined || setting === undefined) {
      return;
    }

    const image = new Image();
    image.src = imageUrl;

    image.onload = (evt) => {
      const target = evt.target as HTMLImageElement;

      setWidth(target.width / 2);
      setHeight(target.height / 2);
    };
  }, [area, imageUrl, setting]);

  if (area === undefined || setting === undefined || !width || !height) {
    return null;
  }

  return (
    <>
      <img
        alt=""
        className={classNames(
          "leaflet-marker-icon",
          "leaflet-zoom-animated",
          "leaflet-interactive"
        )}
        src={imageUrl}
        style={{
          marginLeft: (area.headerOffsetX ?? 0) - 16,
          marginTop: (area.headerOffsetY ?? 0) - 8,
          width: width,
          height: height,
          zIndex: -1,
          outline: "none",
        }}
      />
    </>
  );
}

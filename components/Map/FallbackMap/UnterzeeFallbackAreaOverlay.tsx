import React, { useEffect, useMemo, useState } from "react";
import { ImageOverlay } from "react-leaflet";

import L from "leaflet";

import { xy } from "features/mapping";
import {
  MAP_BASE_URL,
  MAP_ROOT_AREA_THE_UNTERZEE_V2,
} from "features/mapping/constants";
import { getPrefixForSetting } from "features/mapping/getSpriteSheetFilenamesForSetting";

import { IHasSprite, IMappableSetting, ISetting } from "types/map";

type Props = {
  area: IHasSprite;
  setting: ISetting;
};

export default function UnterzeeFallbackAreaOverlay({ area, setting }: Props) {
  const { areaKey, spriteTopLeftX: x, spriteTopLeftY: y } = area;

  const { mapRootArea } = setting;

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const imageUrl = useMemo(() => {
    const mapRootAreaKey = mapRootArea?.areaKey;

    const path =
      mapRootAreaKey === undefined ||
      mapRootAreaKey === MAP_ROOT_AREA_THE_UNTERZEE_V2
        ? "fallback/unterzeev2"
        : getPrefixForSetting(setting as IMappableSetting);

    return `${MAP_BASE_URL}/${path}/${areaKey}-available.png`;
  }, [areaKey, mapRootArea, setting]);

  const bounds = useMemo(() => {
    if (
      x === undefined ||
      y === undefined ||
      width === undefined ||
      height === undefined
    ) {
      return undefined;
    }

    const southWest = xy(x, y);
    const northEast = xy(x + width, y - height);

    return L.latLngBounds(southWest, northEast);
  }, [height, width, x, y]);

  useEffect(() => {
    const image = new Image();
    image.src = imageUrl;

    image.onload = (evt) => {
      const target = evt.target as HTMLImageElement;

      setWidth(target.width);
      setHeight(target.height);
    };
  }, [height, imageUrl, width, x, y]);

  if (bounds === undefined) {
    return null;
  }

  return <ImageOverlay bounds={bounds} url={imageUrl} />;
}

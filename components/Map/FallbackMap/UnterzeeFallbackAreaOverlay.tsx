import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';
import L from 'leaflet';
import { ImageOverlay } from 'react-leaflet';

import { xy } from 'features/mapping';
import {
  MAP_BASE_URL,
  MAP_ROOT_AREA_THE_UNTERZEE,
} from 'features/mapping/constants';
import {
  IHasSprite,
  ISetting,
} from 'types/map';

type Props = {
  area: IHasSprite,
  setting: ISetting,
};

export default function UnterzeeFallbackAreaOverlay({ area, setting }: Props) {
  const {
    areaKey,
    spriteTopLeftX: x,
    spriteTopLeftY: y,
  } = area;
  const { mapRootArea } = setting;

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const imageUrl = useMemo(() => {
    if (mapRootArea?.areaKey === MAP_ROOT_AREA_THE_UNTERZEE) {
      return `${MAP_BASE_URL}/fallback/unterzee/${areaKey}-available.png`;
    }
    return `${MAP_BASE_URL}/fallback/unterzeev2/${areaKey}-available.png`;
  }, [
    areaKey,
    mapRootArea,
  ]);
  const bounds = useMemo(() => (L.latLngBounds(xy(x, y), xy(x + width, y - height))), [
    height,
    width,
    x,
    y,
  ]);

  useEffect(() => {
    const image = new Image();
    image.src = imageUrl;
    image.onload = (evt) => {
      const target = evt.target as HTMLImageElement;
      setWidth(target.width);
      setHeight(target.height);
    };
  }, [height, imageUrl, width, x, y]);

  return (
    <ImageOverlay
      bounds={bounds}
      url={imageUrl}
    />
  );
}
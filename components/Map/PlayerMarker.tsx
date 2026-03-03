import React, { useMemo } from "react";

import { Marker } from "react-leaflet";

import classnames from "classnames";

import L from "leaflet";

import { useAppSelector } from "features/app/store";
import { xy } from "features/mapping";
import {
  PLAYER_MARKER_HEIGHT,
  PLAYER_MARKER_WIDTH,
} from "features/mapping/constants";
import getPlayerMarkerIconURL from "features/mapping/getPlayerMarkerIconURL";

import getIsCurrentPlayerMarkerArea from "selectors/map/getIsCurrentPlayerMarkerArea";

import { IStateAwareArea } from "types/map";

type Props = {
  area: IStateAwareArea;
};

export default function PlayerMarker({ area }: Props) {
  const {
    areaKey,
    labelX,
    labelY,
    pinOffsetX,
    pinOffsetY,
    pinPrefix,
    playerMarkerAnchorX,
    playerMarkerAnchorY,
  } = area;

  const avatarImage = useAppSelector(
    (state) => state.myself.character.avatarImage
  );
  const isCurrentPlayerMarkerArea = useAppSelector((state) =>
    getIsCurrentPlayerMarkerArea(state, { area })
  );

  const iconAnchor = useMemo(() => {
    if (playerMarkerAnchorX && playerMarkerAnchorY) {
      return new L.Point(
        112 / 4 + (pinOffsetX ?? 0),
        159 / 2 + (pinOffsetY ?? 0)
      );
    }

    return new L.Point(
      112 / 4 + 16 + (pinOffsetX ?? 0),
      159 / 2 + 8 + (pinOffsetY ?? 0)
    );
  }, [pinOffsetX, pinOffsetY, playerMarkerAnchorX, playerMarkerAnchorY]);

  const icon = useMemo(() => {
    return new L.Icon({
      className: classnames(
        "map__player-marker",
        isCurrentPlayerMarkerArea && "map__player-marker--visible"
      ),
      iconAnchor,
      iconUrl: getPlayerMarkerIconURL(pinPrefix, avatarImage),
      iconSize: new L.Point(PLAYER_MARKER_WIDTH, PLAYER_MARKER_HEIGHT),
    });
  }, [avatarImage, iconAnchor, isCurrentPlayerMarkerArea, pinPrefix]);

  const position = useMemo(() => {
    if (!(labelX && labelY)) {
      return undefined;
    }

    if (
      playerMarkerAnchorX !== undefined &&
      playerMarkerAnchorY !== undefined
    ) {
      return xy(playerMarkerAnchorX, playerMarkerAnchorY);
    }

    return xy(labelX, labelY);
  }, [labelX, labelY, playerMarkerAnchorX, playerMarkerAnchorY]);

  if (!position) {
    return null;
  }

  return <Marker key={areaKey} icon={icon} position={position} />;
}

PlayerMarker.displayName = "PlayerMarker";

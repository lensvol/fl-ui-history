import React, { useMemo } from "react";
import classnames from "classnames";
import L from "leaflet";
import { xy } from "features/mapping";
import {
  MAP_BASE_URL,
  PLAYER_MARKER_HEIGHT,
  PLAYER_MARKER_WIDTH,
} from "features/mapping/constants";
import { Marker } from "react-leaflet";
import { connect } from "react-redux";
import getCurrentStateAwareArea from "selectors/map/getCurrentStateAwareArea";
import getIsCurrentPlayerMarkerArea from "selectors/map/getIsCurrentPlayerMarkerArea";
import { IAppState } from "types/app";
import { IStateAwareArea } from "types/map";

function PlayerMarker({ area, avatarImage, isCurrentPlayerMarkerArea }: Props) {
  const { areaKey, labelX, labelY, playerMarkerAnchorX, playerMarkerAnchorY } =
    area;

  const iconAnchor = useMemo(() => {
    if (playerMarkerAnchorX && playerMarkerAnchorY) {
      return new L.Point(112 / 4, 159 / 2);
    }
    return new L.Point(112 / 4 + 16, 159 / 2 + 8);
  }, [playerMarkerAnchorX, playerMarkerAnchorY]);

  const icon = useMemo(
    () =>
      new L.Icon({
        iconAnchor,
        className: classnames(
          "map__player-marker",
          isCurrentPlayerMarkerArea && "map__player-marker--visible"
        ),
        iconUrl: `${MAP_BASE_URL}/playermarkers/${avatarImage}-player-marker.png`,
        iconSize: new L.Point(PLAYER_MARKER_WIDTH, PLAYER_MARKER_HEIGHT),
      }),
    [avatarImage, iconAnchor, isCurrentPlayerMarkerArea]
  );

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

type OwnProps = {
  area: IStateAwareArea;
};

type Props = ReturnType<typeof mapStateToProps> & OwnProps;

function mapStateToProps(state: IAppState, props: OwnProps) {
  return {
    avatarImage: state.myself.character.avatarImage,
    currentArea: getCurrentStateAwareArea(state),
    isCurrentPlayerMarkerArea: getIsCurrentPlayerMarkerArea(state, props),
  };
}

export default connect(mapStateToProps)(PlayerMarker);

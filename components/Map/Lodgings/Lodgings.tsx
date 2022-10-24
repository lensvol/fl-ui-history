import React from "react";
import classnames from "classnames";
import { connect } from "react-redux";
import { IAppState } from "types/app";
import {
  LODGINGS_AREA_ID,
  ROUTE_LODGINGS_QUALITY_ID,
} from "features/mapping/constants";
import { IArea } from "types/map";

import { isLodgings } from "features/mapping";
import LodgingsSubArea from "./LodgingsSubArea";

interface OwnProps {
  fallback?: boolean;
  onAreaClick: (_: any, area: IArea) => void;
  onAreaSelect: (area?: IArea) => void;
  selectedArea?: IArea;
}

interface StateProps {
  currentArea?: IArea;
  hasRouteToLodgings: boolean;
  isInLodgings: boolean;
  lodgings?: IArea;
  subAreas: IArea[];
}

type Props = OwnProps & StateProps;

const Lodgings: React.FC<Props> = ({
  fallback,
  lodgings,
  hasRouteToLodgings,
  onAreaClick,
  onAreaSelect,
  selectedArea,
  subAreas,
}) => {
  if (!(lodgings && hasRouteToLodgings)) {
    return null;
  }
  return (
    <div
      className={classnames(
        "map__lodgings-button-container",
        fallback && "map__lodgings-button-container--fallback"
      )}
    >
      {[lodgings, ...subAreas].map((area) => (
        <LodgingsSubArea
          key={area.id}
          area={area}
          onClick={onAreaClick}
          onSelect={onAreaSelect}
          selectedArea={selectedArea}
        />
      ))}
    </div>
  );
};

const mapStateToProps = ({
  map: { areas, currentArea },
  myself: { qualities },
}: IAppState) => {
  const lodgings = (areas || []).find(isLodgings);
  return {
    currentArea,
    lodgings,
    hasRouteToLodgings: !!qualities.find(
      (q) => q.id === ROUTE_LODGINGS_QUALITY_ID
    ),
    isInLodgings:
      (currentArea?.id ?? LODGINGS_AREA_ID - 1) === LODGINGS_AREA_ID,
    subAreas: lodgings?.childAreas ?? [],
  };
};

export default connect(mapStateToProps)(Lodgings);

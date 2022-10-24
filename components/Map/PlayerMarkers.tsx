import React, { Fragment } from "react";
import { connect } from "react-redux";
import getStateAwareAreas from "selectors/map/getStateAwareAreas";
import { IAppState } from "types/app";
import PlayerMarker from "components/Map/PlayerMarker";

type Props = ReturnType<typeof mapStateToProps>;

export function PlayerMarkers({ areas }: Props) {
  return (
    <Fragment>
      {(areas || [])
        .filter(
          (area) => area.labelX !== undefined && area.labelY !== undefined
        )
        .map((area) => (
          <PlayerMarker area={area} key={area.areaKey} />
        ))}
    </Fragment>
  );
}

const mapStateToProps = (state: IAppState) => ({
  areas: getStateAwareAreas(state),
});

export default connect(mapStateToProps)(PlayerMarkers);

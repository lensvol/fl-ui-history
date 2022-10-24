import React from "react";
import { connect } from "react-redux";
import SelectedAreaContext from "components/Map/SelectedAreaContext";
import MapModalTooltipContext from "components/Map/MapModalTooltipContext";

import { IAppState } from "types/app";
import asStateAwareArea from "features/mapping/asStateAwareArea";
import { IMappableSetting } from "types/map";
import InteractiveMarker from "./InteractiveMarker";
import { ContainerProps } from "./props";

export function InteractiveMarkerContainer(props: ContainerProps & StateProps) {
  const { areas, setting } = props;
  return (
    <SelectedAreaContext.Consumer>
      {({ selectedArea }) => (
        <MapModalTooltipContext.Consumer>
          {({ openModalTooltip }) => {
            // Ensure we pass InteractiveMarker an IStateAwareArea
            const stateAwareSelectedArea = selectedArea
              ? asStateAwareArea(
                  selectedArea,
                  areas ?? [],
                  setting,
                  selectedArea
                )
              : selectedArea;

            return (
              <InteractiveMarker
                {...props}
                selectedArea={stateAwareSelectedArea}
                openModalTooltip={openModalTooltip}
              />
            );
          }}
        </MapModalTooltipContext.Consumer>
      )}
    </SelectedAreaContext.Consumer>
  );
}

const mapStateToProps = ({ map: { areas, setting } }: IAppState) => ({
  areas,
  setting: setting as IMappableSetting,
});

type StateProps = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(InteractiveMarkerContainer);

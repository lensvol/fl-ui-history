import React from "react";

import InteractiveMarker from "components/Map/InteractiveMarker/InteractiveMarker";
import { ContainerProps } from "components/Map/InteractiveMarker/props";
import MapModalTooltipContext from "components/Map/MapModalTooltipContext";
import SelectedAreaContext from "components/Map/SelectedAreaContext";

import { useAppSelector } from "features/app/store";
import asStateAwareArea from "features/mapping/asStateAwareArea";

import { IMappableSetting } from "types/map";

type Props = ContainerProps;

export default function InteractiveMarkerContainer({
  area,
  currentArea,
  onAreaClick,
  onAreaSelect,
  onTapAtLowZoomLevel,
  zoomLevel,
}: Props) {
  const areas = useAppSelector((state) => state.map.areas);
  const setting = useAppSelector(
    (state) => state.map.setting
  ) as IMappableSetting;

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
                area={area}
                currentArea={currentArea}
                onAreaClick={onAreaClick}
                onAreaSelect={onAreaSelect}
                onTapAtLowZoomLevel={onTapAtLowZoomLevel}
                openModalTooltip={openModalTooltip}
                selectedArea={stateAwareSelectedArea}
                setting={setting}
                zoomLevel={zoomLevel}
              />
            );
          }}
        </MapModalTooltipContext.Consumer>
      )}
    </SelectedAreaContext.Consumer>
  );
}

InteractiveMarkerContainer.displayName = "InteractiveMarkerContainer";

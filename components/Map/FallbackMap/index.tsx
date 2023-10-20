import { isUnterzeeSetting } from "features/mapping";
import React, { useCallback, useMemo, useState } from "react";
import { ITooltipData } from "components/ModalTooltip/types";
import { MAP_ROOT_AREA_THE_FIFTH_CITY } from "features/mapping/constants";
import { connect } from "react-redux";
import { IAppState } from "types/app";
import LondonFallbackMap from "./LondonFallbackMap";
import UnterzeeFallbackMap from "./UnterzeeFallbackMap";
import MapModalTooltipContext from "../MapModalTooltipContext";
import { OwnProps } from "./props";

function FallbackMap({ setting, ...restProps }: Props) {
  const { onAreaSelect } = restProps;
  const mapRootAreaKey = setting?.mapRootArea?.areaKey;

  const [isModalTooltipOpen, setIsModalTooltipOpen] = useState(false);
  const [tooltipData, setTooltipData] = useState({});

  const handleOpenModalTooltip = useCallback((newTooltipData: ITooltipData) => {
    setIsModalTooltipOpen(true);
    setTooltipData(newTooltipData);
  }, []);

  const handleRequestCloseModalTooltip = useCallback(() => {
    setIsModalTooltipOpen(false);
    onAreaSelect();
  }, [onAreaSelect]);

  const mapToShow = useMemo(() => {
    if (setting?.mapRootArea?.areaKey === MAP_ROOT_AREA_THE_FIFTH_CITY) {
      return (
        <LondonFallbackMap
          {...restProps}
          isModalTooltipOpen={isModalTooltipOpen}
          tooltipData={tooltipData}
        />
      );
    }
    if (isUnterzeeSetting(setting)) {
      return (
        <UnterzeeFallbackMap
          {...restProps}
          isModalTooltipOpen={isModalTooltipOpen}
          tooltipData={tooltipData}
        />
      );
    }
    return null;
  }, [isModalTooltipOpen, restProps, setting, tooltipData]);

  // If we have no map root area, return null

  if (!mapRootAreaKey) {
    return null;
  }

  return (
    <MapModalTooltipContext.Provider
      value={{
        onRequestClose: handleRequestCloseModalTooltip,
        openModalTooltip: handleOpenModalTooltip,
      }}
    >
      {mapToShow}
    </MapModalTooltipContext.Provider>
  );
}

const mapStateToProps = (state: IAppState) => ({ setting: state.map.setting });

type Props = OwnProps & ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(FallbackMap);

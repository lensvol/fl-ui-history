import { BaseProps } from "components/Map/PixiMap/props";
import { isUnterzeeSetting } from "features/mapping";
import { MAP_ROOT_AREA_THE_FIFTH_CITY } from "features/mapping/constants";
import React, { useState } from "react";
import { connect } from "react-redux";
import { IAppState } from "types/app";
import LondonPixiMap from "./LondonPixiMap";
import UnterzeePixiMap from "./UnterzeePixiMap";

type StateProps = ReturnType<typeof mapStateToProps>;
type Props = BaseProps & StateProps;

export function PixiMap(props: Props) {
  const { setting, ...restProps } = props;
  const [isModalTooltipOpen, setIsModalTooltipOpen] = useState(false);
  const [tooltipData, setTooltipData] = useState({});

  if (setting.mapRootArea?.areaKey === MAP_ROOT_AREA_THE_FIFTH_CITY) {
    return <LondonPixiMap {...restProps} />;
  }

  if (isUnterzeeSetting(setting)) {
    return (
      <UnterzeePixiMap
        {...restProps}
        isModalTooltipOpen={isModalTooltipOpen}
        setIsModalTooltipOpen={setIsModalTooltipOpen}
        tooltipData={tooltipData}
        setTooltipData={setTooltipData}
      />
    );
  }

  return null;
}

const mapStateToProps = (state: IAppState) => ({
  setting: state.map.setting!,
});

export default connect(mapStateToProps)(PixiMap);

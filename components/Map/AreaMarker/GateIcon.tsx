import React from "react";
import { connect } from "react-redux";
import { IAppState } from "types/app";
import { IStateAwareArea } from "types/map";
import getGateIconClassNameForCurrentSetting from "selectors/map/getGateIconClassNameForCurrentSetting";
import getGateIconPathForCurrentSetting from "selectors/map/getGateIconPathForCurrentSetting";

interface OwnProps {
  area: IStateAwareArea;
  selected?: boolean;
}

export function GateIcon({ className, icon }: Props) {
  return <img alt="" src={icon} className={className} />;
}

const mapStateToProps = (state: IAppState, props: OwnProps) => ({
  className: getGateIconClassNameForCurrentSetting(state, props),
  icon: getGateIconPathForCurrentSetting(state),
});

export interface Props extends OwnProps, ReturnType<typeof mapStateToProps> {}

export default connect(mapStateToProps)(GateIcon);

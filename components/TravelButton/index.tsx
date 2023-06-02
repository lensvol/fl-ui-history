import { fetch as fetchMap, toggleMapView } from "actions/map";
import classnames from "classnames";
import getShouldShowTravelButtonLabel from "selectors/map/getShouldShowTravelButtonLabel";
import getTravelButtonLabel from "selectors/map/getTravelButtonLabel";

import * as phases from "constants/phases";
import React, { useCallback, useMemo } from "react";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { ThunkDispatch } from "redux-thunk";
import { IAppState } from "types/app";
import { ISetting } from "types/map";
import { StoryletPhase } from "types/storylet";
import { UIRestriction } from "types/myself";

function TravelButton({
  canOpenMap,
  className,
  dispatch,
  history,
  label,
  phase,
  setting,
  shouldMapUpdate,
  shouldShowTravelButton,
  enableTravelUI,
}: Props) {
  const handleClick = useCallback(() => {
    if (shouldMapUpdate) {
      dispatch(fetchMap());
    }
    dispatch(toggleMapView());
  }, [dispatch, shouldMapUpdate]);

  const disabled = useMemo(
    () =>
      !canOpenMap ||
      phase !== phases.AVAILABLE ||
      history.location.pathname !== "/" ||
      !enableTravelUI,
    [canOpenMap, history.location.pathname, phase, enableTravelUI]
  );

  if (!shouldShowTravelButton) {
    return null;
  }

  if (!setting) {
    return null;
  }

  return (
    <button
      className={classnames("button button--primary", className)}
      onClick={handleClick}
      disabled={disabled}
      type="button"
    >
      {label}
    </button>
  );
}

TravelButton.defaultProps = {
  className: "",
};

TravelButton.displayName = "TravelButton";

interface OwnProps {
  dispatch: ThunkDispatch<any, any, any>;
  className?: string;
}

const mapStateToProps = (state: IAppState) => {
  const {
    map: { setting, shouldUpdate },
    storylet: { phase },
    myself: { uiRestrictions },
  } = state;
  return {
    phase,
    setting,
    shouldMapUpdate: shouldUpdate,
    canOpenMap: setting?.canOpenMap ?? false,
    label: getTravelButtonLabel(state),
    shouldShowTravelButton: getShouldShowTravelButtonLabel(state),
    enableTravelUI: !uiRestrictions?.find(
      (restriction) => restriction === UIRestriction.Travel
    ),
  };
};

interface Props
  extends OwnProps,
    RouteComponentProps,
    ReturnType<typeof mapStateToProps> {
  phase: StoryletPhase;
  label: string;
  setting: ISetting | undefined;
  shouldMapUpdate: boolean;
  canOpenMap: boolean;
}

export default withRouter(connect(mapStateToProps)(TravelButton));

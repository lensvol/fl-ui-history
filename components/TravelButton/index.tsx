import React, { useCallback, useMemo } from "react";

import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

import classnames from "classnames";

import { fetchMap, toggleMapView } from "actions/map";

import { AVAILABLE } from "constants/phases";

import { useAppSelector } from "features/app/store";

import getShouldShowTravelButtonLabel from "selectors/map/getShouldShowTravelButtonLabel";
import getTravelButtonLabel from "selectors/map/getTravelButtonLabel";

import { UIRestriction } from "types/myself";

interface Props {
  className?: string;
}

export default function TravelButton({ className }: Props) {
  const canOpenMap = useAppSelector(
    (state) => state.map.setting?.canOpenMap ?? false
  );
  const uiRestrictions =
    useAppSelector((state) => state.myself.uiRestrictions) ?? [];
  const enableTravelUI = !uiRestrictions.find(
    (restriction) => restriction === UIRestriction.Travel
  );
  const label = useAppSelector((state) => getTravelButtonLabel(state));
  const phase = useAppSelector((state) => state.storylet.phase);
  const setting = useAppSelector((state) => state.map.setting);
  const shouldMapUpdate = useAppSelector((state) => state.map.shouldUpdate);
  const shouldShowTravelButton = useAppSelector((state) =>
    getShouldShowTravelButtonLabel(state)
  );

  const dispatch = useDispatch();
  const location = useLocation();
  const { pathname } = location;

  const handleClick = useCallback(() => {
    if (shouldMapUpdate) {
      dispatch(fetchMap());
    }

    dispatch(toggleMapView());
  }, [dispatch, shouldMapUpdate]);

  const disabled = useMemo(
    () =>
      !canOpenMap || phase !== AVAILABLE || pathname !== "/" || !enableTravelUI,
    [canOpenMap, pathname, phase, enableTravelUI]
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
      disabled={disabled}
      onClick={handleClick}
      type="button"
    >
      {label}
    </button>
  );
}

TravelButton.displayName = "TravelButton";

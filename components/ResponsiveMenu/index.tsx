import React, { useCallback, useMemo } from "react";
import ReactCSSTransitionReplace from "react-css-transition-replace";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

import classnames from "classnames";

import { fetchMap, toggleMapView } from "actions/map";
import { openSidebar } from "actions/sidebar";

import MediaSmDown from "components/Responsive/MediaSmDown";

import { useAppSelector } from "features/app/store";

import { UIRestriction } from "types/myself";

import getImagePath from "utils/getImagePath";

export default function ResponsiveMenuContainer() {
  const currentArea = useAppSelector((state) => state.map.currentArea);
  const uiRestrictions =
    useAppSelector((state) => state.myself.uiRestrictions) ?? [];
  const enableTravelUI = !uiRestrictions.find(
    (restriction) => restriction === UIRestriction.Travel
  );
  const phase = useAppSelector((state) => state.storylet.phase);
  const setting = useAppSelector((state) => state.map.setting);
  const shouldMapUpdate = useAppSelector((state) => state.map.shouldUpdate);

  const dispatch = useDispatch();
  const location = useLocation();
  const { pathname } = location;

  const backgroundImage = useMemo(() => {
    const icon = currentArea ? currentArea.image : undefined;

    const imagePath = getImagePath({
      icon,
      type: "header",
    });

    return `${imagePath}`;
  }, [currentArea]);

  const isMapEnabled = useMemo(
    () =>
      setting &&
      setting?.canOpenMap &&
      phase === "Available" &&
      pathname === "/" &&
      enableTravelUI,
    [enableTravelUI, pathname, phase, setting]
  );

  const mapTitle = useMemo(() => {
    if (
      setting &&
      setting?.canOpenMap &&
      phase === "Available" &&
      enableTravelUI
    ) {
      return "Map";
    }

    return "Map - you cannot move right now";
  }, [enableTravelUI, phase, setting]);

  const onOpenSidebar = useCallback(() => dispatch(openSidebar()), [dispatch]);

  const onToggleMap = useCallback(() => {
    if (!isMapEnabled) {
      return;
    }

    if (shouldMapUpdate) {
      dispatch(fetchMap());
    }

    dispatch(toggleMapView());
  }, [dispatch, isMapEnabled, shouldMapUpdate]);

  return (
    <ReactCSSTransitionReplace
      // eslint-disable-next-line
      // @ts-ignore
      childComponent="div"
      transitionName="fade"
      transitionEnterTimeout={1000}
      transitionLeaveTimeout={1000}
    >
      <nav
        key={backgroundImage}
        className="banner banner--md-down"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      >
        <ul className="banner__list--md-down">
          <li className="banner-item">
            <button
              title="Menu"
              className="button--link banner__button"
              onClick={onOpenSidebar}
              type="button"
            >
              <i className="fa fa-bars fa-3x" />
              <span className="u-visually-hidden">Menu</span>
            </button>
          </li>

          <MediaSmDown>
            <li className="banner-item">
              <button
                className="button--link banner__button"
                title={mapTitle}
                onClick={onToggleMap}
                type="button"
              >
                <i
                  className={classnames(
                    "fa fa-compass fa-3x",
                    "icon--has-transition",
                    !isMapEnabled && "icon--disabled"
                  )}
                />
                <span className="u-visually-hidden">Map</span>
              </button>
            </li>
          </MediaSmDown>
        </ul>
      </nav>
    </ReactCSSTransitionReplace>
  );
}

ResponsiveMenuContainer.displayName = "ResponsiveMenuContainer";

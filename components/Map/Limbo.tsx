import React, { useCallback, useMemo } from "react";

import Interactive from "react-interactive";

import { useDispatch } from "react-redux";

import classnames from "classnames";

import { openModalTooltip } from "actions/modalTooltip";

import TippyWrapper from "components/TippyWrapper";

import { useAppSelector } from "features/app/store";
import { areaToTooltipData, isUnterzeeSetting } from "features/mapping";
import asStateAwareArea from "features/mapping/asStateAwareArea";
import { MAP_BASE_URL } from "features/mapping/constants";

import { IMappableSetting } from "types/map";

const noop = () => {};

export default function Limbo() {
  const areas = useAppSelector((state) => state.map.areas);
  const avatarImage = useAppSelector(
    (state) => state.myself.character.avatarImage
  );
  const currentArea = useAppSelector((state) => state.map.currentArea);
  const setting = useAppSelector((state) => state.map.setting);

  const dispatch = useDispatch();

  const tooltipData = useMemo(
    () => ({
      ...areaToTooltipData(
        asStateAwareArea(
          currentArea!,
          areas || [],
          setting! as IMappableSetting,
          currentArea
        ),
        currentArea,
        !!setting?.canTravel,
        noop,
        true
      ),
      name: `Your location: ${currentArea?.name}`,
    }),
    [areas, currentArea, setting]
  );

  const handleStateChange = useCallback(
    ({ nextState, event }) => {
      event.preventDefault();

      const { iState } = nextState;

      if (/touchActive/.test(iState)) {
        dispatch(openModalTooltip(tooltipData));
      }
    },
    [dispatch, tooltipData]
  );

  return (
    <div
      className={classnames(
        "map-limbo",
        isUnterzeeSetting(setting) && "map-limbo--unterzee"
      )}
    >
      <PlayerMarker avatarImage={avatarImage} />
      <Interactive as="div" onStateChange={handleStateChange}>
        <TippyWrapper tooltipData={tooltipData}>
          <img
            alt="In limbo"
            className="map-limbo__signpost"
            src="/map/signpost-icon.png"
          />
        </TippyWrapper>
      </Interactive>
    </div>
  );
}

Limbo.displayName = "Limbo";

function PlayerMarker({ avatarImage }: { avatarImage: string }) {
  return (
    <img
      alt="Player marker"
      className="map-limbo__player-marker"
      src={`${MAP_BASE_URL}/playermarkers/${avatarImage}-player-marker.png`}
    />
  );
}

PlayerMarker.displayName = "PlayerMarker";

import React from "react";

import { useDispatch } from "react-redux";

import { setFallbackMapPreferred } from "actions/map";

import { useAppSelector } from "features/app/store";

export default function MapSettings() {
  const dispatch = useDispatch();

  const fallbackMapPreferred = useAppSelector(
    (state) => state.map.fallbackMapPreferred
  );

  const onChange = (e: any) => {
    const value = e.target.checked;

    dispatch(setFallbackMapPreferred(value));

    window.localStorage.setItem("use-fallback-map", value.toString());
  };

  return (
    <div>
      <h2 className="heading heading--2" id="map-settings">
        Map settings
      </h2>

      <ul>
        <li className="checkbox">
          <label>
            <input
              checked={fallbackMapPreferred}
              id="js-map-compatibility-preference"
              onChange={onChange}
              type="checkbox"
            />
            Prefer compatibility version in this browser
          </label>
        </li>
      </ul>
    </div>
  );
}

MapSettings.displayName = "MapSettings";

import React from "react";
import { connect } from "react-redux";
import { IAppState } from "types/app";
import { setFallbackMapPreferred } from "actions/map";

interface Props {
  dispatch: Function;
  fallbackMapPreferred: boolean;
}

export function MapSettings({ dispatch, fallbackMapPreferred }: Props) {
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
              id="js-map-compatibility-preference"
              type="checkbox"
              checked={fallbackMapPreferred}
              onChange={onChange}
            />
            Prefer compatibility version in this browser
          </label>
        </li>
      </ul>
    </div>
  );
}

const mapStateToProps = ({ map: { fallbackMapPreferred } }: IAppState) => ({
  fallbackMapPreferred,
});

export default connect(mapStateToProps)(MapSettings);

import {
  isUnterzeePlanningSetting,
  isUnterzeeSetting,
} from 'features/mapping';
import { createSelector } from 'reselect';
import { IAppState } from 'types/app';

const GATE_ICON_IMAGE_PATH_GATE = '/img/gate-icon.png';
const GATE_ICON_IMAGE_PATH_WHEEL = '/img/ships-wheel-icon.png';

const getCurrentSetting = (state: IAppState) => state.map.setting;

const outputFn = (setting: ReturnType<typeof getCurrentSetting>) => {
  // If we are charting a course, we'll want a ship's wheel
  if (isUnterzeePlanningSetting(setting)) {
    return GATE_ICON_IMAGE_PATH_WHEEL;
  }
  // If we're actually at sea, we might want something else
  if (isUnterzeeSetting(setting)) {
    return GATE_ICON_IMAGE_PATH_WHEEL;
  }
  // Otherwise, default to the gate icon
  return GATE_ICON_IMAGE_PATH_GATE;
};

export default createSelector(getCurrentSetting, outputFn);
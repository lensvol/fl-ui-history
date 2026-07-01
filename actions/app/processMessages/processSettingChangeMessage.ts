import { ThunkDispatch } from "redux-thunk";

import { fetchMap, setCurrentSetting } from "actions/map";

import { clearContainerAndCaches } from "components/Map/ReactLeafletPixiOverlay/sprite-caches";

import { IAppState } from "types/app";
import { ISettingChangeMessage } from "types/app/messages";

export default function processSettingChangeMessage(
  message: ISettingChangeMessage
) {
  return (
    dispatch: ThunkDispatch<any, any, any>,
    getState: () => IAppState
  ) => {
    const { map } = getState();
    const setting = message?.setting;

    // If we are able to travel in the new Setting but have no map locations, then retrieve them
    const oldMapRootAreaKey = map.setting?.mapRootArea?.areaKey;
    const newMapRootAreaKey = setting?.mapRootArea?.areaKey;
    const hasMapRootAreaChanged = newMapRootAreaKey !== oldMapRootAreaKey;

    if (hasMapRootAreaChanged) {
      clearContainerAndCaches();
    }

    // Update our Setting
    dispatch(setCurrentSetting(setting));

    if (setting?.canOpenMap && !map.areas) {
      dispatch(
        fetchMap({
          hasMapRootAreaChanged,
        })
      );
    }

    return message;
  };
}

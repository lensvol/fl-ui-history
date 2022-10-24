import { fetch as fetchMap, setCurrentSetting } from "actions/map";
import { ThunkDispatch } from "redux-thunk";
import { IAppState } from "types/app";
import { ISettingChangeMessage } from "types/app/messages";
import * as SpriteCache from "components/Map/ReactLeafletPixiOverlay/sprite-caches";

export default function processSettingChangeMessage(
  message: ISettingChangeMessage
) {
  return (
    dispatch: ThunkDispatch<any, any, any>,
    getState: () => IAppState
  ) => {
    const { map } = getState();
    const { setting } = message;

    // If we are able to travel in the new Setting but have no
    // map locations, then retrieve them
    const { canOpenMap, mapRootArea } = setting;
    const oldMapRootAreaKey = getState().map.setting?.mapRootArea?.areaKey;
    const newMapRootAreaKey = mapRootArea?.areaKey;
    const hasMapRootAreaChanged = newMapRootAreaKey !== oldMapRootAreaKey;

    if (hasMapRootAreaChanged) {
      SpriteCache.clearContainerAndCaches();
    }

    // Update our Setting
    dispatch(setCurrentSetting(setting));

    if (canOpenMap && !map.areas) {
      dispatch(fetchMap({ hasMapRootAreaChanged }));
    }

    return message;
  };
}

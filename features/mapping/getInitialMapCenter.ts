import { IMappableSetting } from "types/map";

export interface IMapCenterDimensions {
  initPercentX: number;
  initPercentY: number;
}

export default function getInitialMapCenter(
  setting: IMappableSetting
): IMapCenterDimensions {
  return {
    initPercentX: setting.jsonInfo?.initPercentX ?? 50,
    initPercentY: setting.jsonInfo?.initPercentY ?? 0, // maintain behaviour of old bug
  };
}

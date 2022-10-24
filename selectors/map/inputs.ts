import { IAppState } from "types/app";
import { IMappableSetting } from "types/map";

export const getAreas = (state: IAppState) => state.map.areas || [];
export const getCurrentArea = (state: IAppState) => state.map.currentArea;
export const getSetting = (state: IAppState) =>
  state.map.setting! as IMappableSetting;

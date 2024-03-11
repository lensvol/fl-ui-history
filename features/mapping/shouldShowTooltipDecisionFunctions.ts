import {
  MAP_ROOT_AREA_THE_FIFTH_CITY,
  MAP_ROOT_AREA_THE_UNTERZEE,
  MAP_ROOT_AREA_THE_UNTERZEE_V2,
} from "features/mapping/constants";

import { IArea } from "types/map";

const shouldShowTooltipDecisionFunctions: {
  [key: string]: (area: IArea) => boolean;
} = {
  [MAP_ROOT_AREA_THE_FIFTH_CITY]: (area: IArea) => area.type !== "Landmark",
  [MAP_ROOT_AREA_THE_UNTERZEE]: (_area: IArea) => true,
  [MAP_ROOT_AREA_THE_UNTERZEE_V2]: (_area: IArea) => true,
};

export default shouldShowTooltipDecisionFunctions;

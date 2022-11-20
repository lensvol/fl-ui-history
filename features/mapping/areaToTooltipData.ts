import { IArea, IStateAwareArea } from "types/map";
import getImagePath from "utils/getImagePath";
import createAreaTooltipButtons from "./createAreaTooltipButtons";
import { SmallButton } from "./types";

export default function areaToTooltipData(
  area: IStateAwareArea,
  currentArea: IArea | undefined,
  canTravel: boolean,
  onAreaClick?: (_: any, area: IArea) => void,
  showImage = true,
  smallButtons?: SmallButton[]
) {
  const { description, name, image, unlocked, unavailableDescription } = area;

  return {
    name,
    smallButtons:
      smallButtons ??
      createAreaTooltipButtons(area, currentArea, canTravel, onAreaClick),
    description: unlocked ? description : unavailableDescription,
    image: showImage ? image : undefined,
    imagePath: showImage
      ? getImagePath({ icon: image, type: "small-icon" })
      : undefined,
  };
}

import shouldShowTooltipDecisionFunctions from "features/mapping/shouldShowTooltipDecisionFunctions";
import { IArea, ISetting } from "types/map";

export default function shouldShowTooltip(
  area: IArea,
  setting: ISetting | undefined
  // { mapRootArea: { areaKey } }: Pick<IMappableSetting, 'mapRootArea'>,
): boolean {
  // If we have no areaKey, return false
  const areaKey = setting?.mapRootArea?.areaKey;
  if (!areaKey) {
    return false;
  }

  // Try and find the function that decides whether to show a tooltip;
  // if we don't find one, return false

  const decisionFunction = shouldShowTooltipDecisionFunctions[areaKey];
  if (decisionFunction === undefined) {
    return false;
  }

  return shouldShowTooltipDecisionFunctions[areaKey](area);
}

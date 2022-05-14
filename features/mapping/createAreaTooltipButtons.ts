import { SmallButton } from 'features/mapping/types';
import { IArea, IStateAwareArea } from 'types/map';

export default function createAreaTooltipButtons(
  area: IStateAwareArea,
  currentArea: IArea | undefined,
  canTravel: boolean,
  onAreaClick?: (_: any, area: IArea) => void,
): SmallButton[] {

  // If this straight up is not an area we can move to,
  // or if we can't travel in this Setting,
  // then don't show any buttons
  if (!area.canMoveTo || !canTravel) {
    return [];
  }

  // We can't travel if we don't know how to travel,
  // or if the area's locked
  if (!onAreaClick || !(area.unlocked || area.gateEvent)) {
    return [];
  }

  // We can't travel to where we already are
  if (area.id === currentArea?.id) {
    return [];
  }

  const action = (e: any) => onAreaClick(e, area);
  const label = area.shouldShowGateIcon ? 'Go' : 'Travel';

  return [{ label, action }];
}

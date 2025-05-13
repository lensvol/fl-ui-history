import { Plot } from "types/agents";

export default function plotSorter(a: Plot, b: Plot) {
  if (a.id === b.id) {
    return 0;
  }

  if (a.qualityLocked !== b.qualityLocked) {
    return a.qualityLocked ? 1 : -1;
  }

  const aHasCost = a.currencyCost > 0;
  const bHasCost = b.currencyCost > 0;

  if (aHasCost !== bHasCost) {
    return aHasCost ? 1 : -1;
  }

  return a.id - b.id;
}

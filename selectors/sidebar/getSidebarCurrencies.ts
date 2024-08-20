import { createSelector } from "reselect";
import { IAppState } from "types/app";
import { IQuality } from "types/qualities";

// Quality IDs of currencies to show in sidebar, in the order they should appear
const SCRIP_QUALITY_IDS = [
  125025, // Hinterland Scrip
  144995, // Stuiver
  143057, // Rat-Shilling
];

function getQualities(state: IAppState): IQuality[] {
  return state.myself.qualities;
}

function isCurrency(quality: IQuality): boolean {
  return quality.category === "Currency";
}

function getSidebarCurrencies(qualities: IQuality[]): IQuality[] {
  return qualities
    .filter((quality) => isCurrency(quality))
    .filter((scrip) => shouldAppearInSidebar(scrip, qualities))
    .sort((a, b) => sortCurrencies(a, b));
}

function shouldAppearInSidebar(
  scrip: IQuality,
  qualities: IQuality[]
): boolean {
  if (!SCRIP_QUALITY_IDS.includes(scrip.id)) {
    return false;
  }

  if (scrip.id === 125025) {
    const railwayVentureQuality = qualities.find((q) => q.id === 140992);

    return (railwayVentureQuality?.effectiveLevel ?? 0) >= 50;
  }

  return true;
}

function sortCurrencies(a: IQuality, b: IQuality): number {
  const indexOfA = SCRIP_QUALITY_IDS.indexOf(a.id);
  const indexOfB = SCRIP_QUALITY_IDS.indexOf(b.id);

  return indexOfA - indexOfB;
}

export default createSelector(getQualities, getSidebarCurrencies);

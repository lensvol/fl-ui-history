import {
  isBackgroundSpriteRecord,
  isForegroundSpriteRecord,
  isSeaSpriteRecord,
  isSelectionSpriteRecord,
  isUnterzeeBackgroundSpriteRecord,
} from "features/mapping/util";
import { IArea, SpriteRecord } from "types/map";
import drawSpriteRecords from "./drawSpriteRecords";

export default async function drawAreas(
  sortedSpriteRecords: SpriteRecord[],
  areas: IArea[]
): Promise<void> {
  // Order the sprites and exclude the background
  const filteredSpriteRecords = sortedSpriteRecords.filter(
    (sr) =>
      !isSeaSpriteRecord(sr) &&
      !isBackgroundSpriteRecord(sr) &&
      !isUnterzeeBackgroundSpriteRecord(sr) &&
      !isForegroundSpriteRecord(sr) &&
      !isSelectionSpriteRecord(sr)
  );

  await drawSpriteRecords(filteredSpriteRecords, areas);
}

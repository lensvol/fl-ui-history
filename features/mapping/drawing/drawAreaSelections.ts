import drawSpriteRecords from "features/mapping/drawing/drawSpriteRecords";
import {
  isBackgroundSpriteRecord,
  isForegroundSpriteRecord,
  isSeaSpriteRecord,
  isSelectionSpriteRecord,
} from "features/mapping/util";
import { IArea, SpriteRecord } from "types/map";

export default async function drawAreaSelections(
  spriteRecords: SpriteRecord[],
  areas: IArea[]
) {
  // Filter the sprite records
  const filteredSpriteRecords = spriteRecords.filter(
    (sr) =>
      !isSeaSpriteRecord(sr) &&
      !isBackgroundSpriteRecord(sr) &&
      !isForegroundSpriteRecord(sr) &&
      isSelectionSpriteRecord(sr)
  );

  await drawSpriteRecords(filteredSpriteRecords, areas);
}

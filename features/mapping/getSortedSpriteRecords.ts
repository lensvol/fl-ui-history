import { SELECTION_SPRITE_SUFFIXES } from 'features/mapping/constants';
import makeSpriteRecordComparator from 'features/mapping/makeSpriteRecordComparator';
import { IArea, SpriteRecord } from 'types/map';

export default function getSortedSpriteRecords(unsortedSpriteRecords: SpriteRecord[], areas: IArea[]) {
  // Sort sprite records, putting districts lower in the stack
  const spriteRecords = [...unsortedSpriteRecords].sort(makeSpriteRecordComparator(areas));

  // We need to load and render non-selections first, so that selections sit on top
  const notSelections = spriteRecords.filter(sr => SELECTION_SPRITE_SUFFIXES.indexOf(sr[1]) < 0);
  const selections = spriteRecords.filter(sr => SELECTION_SPRITE_SUFFIXES.indexOf(sr[1]) >= 0);

  // Order selections so that non-selections are lower in the stack than selections
  return [...notSelections, ...selections];
}

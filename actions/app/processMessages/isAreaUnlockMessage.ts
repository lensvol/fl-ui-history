// Henry's list of qualities that unlock areas
const AREA_UNLOCK_QUALITIES = [
  427, 428, 429, 430, 474, 550, 604, 625, 696, 803, 859, 12293,
];

export default function isAreaUnlockMessage(message?: any) {
  if (!message) {
    return false;
  }
  return AREA_UNLOCK_QUALITIES.indexOf(message.qualityId) >= 0;
}

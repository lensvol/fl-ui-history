import { IEnhancement } from "types/qualities";

export function formatEnhancement(e: IEnhancement): string {
  return `${e.qualityName} ${e.level > 0 ? "+" : ""}${e.level}`;
}

export function formatEnhancementList(
  enhancements: IEnhancement[] | undefined
): string {
  if (!enhancements?.length) {
    return "";
  }
  return enhancements.map(formatEnhancement).join("; ");
}

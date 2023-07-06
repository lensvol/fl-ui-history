import { IEnhancement } from "types/qualities";

function menaceEnhancementScale(level: number): string {
  if (level === 0) {
    // should never happen, but when does that ever stop it?
    return "Has no effect on";
  }

  switch (level) {
    case -2:
      return "Greatly reduces";

    case -1:
      return "Reduces";

    case 1:
      return "Increases";

    case 2:
      return "Greatly increases";
  }

  if (level > 2) {
    return "Massively increases";
  }

  // reaching here means level < -2
  return "Massively reduces";
}

export function formatEnhancement(e: IEnhancement): string {
  if (e.category === "Menace") {
    return `${menaceEnhancementScale(e.level)} ${e.qualityName} build up`;
  }

  return `${e.qualityName} ${e.level > 0 ? "+" : ""}${e.level}`;
}

export function formatEnhancementList(
  enhancements: IEnhancement[] | undefined
): string {
  if (!enhancements?.length) {
    return "";
  }

  const nonMenaces = enhancements
    .filter((enhancement) => enhancement.category !== "Menace")
    .map(formatEnhancement);
  const menaces = enhancements
    .filter((enhancement) => enhancement.category === "Menace")
    .map(formatEnhancement);

  return [...nonMenaces, ...menaces].join("; ");
}

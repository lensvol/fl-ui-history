import { IQuality } from "types/qualities";

type QualityData = IQuality & { levelDescription?: string; useCap?: boolean };

export function buildTooltipData(data: QualityData) {
  const {
    availableAt,
    cap,
    description,
    levelDescription,
    useCap,
    effectiveLevel: level,
    name: baseName,
  } = data;
  // If we have a level description, use name + level + leveldescription
  const name = buildLevelDescription({
    cap,
    levelDescription,
    level,
    useCap,
    name: baseName,
  });
  const secondaryDescription = availableAt;

  return {
    description,
    name,
    secondaryDescription,
  };
}

export function buildLevelDescription({
  cap,
  name,
  level,
  levelDescription,
  useCap,
}: Pick<
  QualityData,
  "name" | "level" | "levelDescription" | "cap" | "useCap"
>) {
  const bits = [
    name,
    level.toLocaleString("en-GB"),
    `${(useCap ?? false) && cap !== undefined ? ` / ${cap.toLocaleString("en-GB")}` : ""}`,
    levelDescription ? `— ${levelDescription}` : "",
  ];
  return bits.join(" ");
}

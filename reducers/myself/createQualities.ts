import { IQuality } from "types/qualities";

interface IQualityGroup {
  possessions: IQuality[];
}

export default function createQualities(
  stateQualities: IQuality[],
  qualityGroups: IQualityGroup[]
) {
  return [
    ...qualityGroups
      .flatMap((group) => group.possessions)
      .map((quality) => ({
        ...quality,
        isOutfit:
          quality.isOutfit === undefined
            ? stateQualities.find((q) => q.id === quality.id)?.isOutfit
            : quality.isOutfit,
      })),
  ];
}

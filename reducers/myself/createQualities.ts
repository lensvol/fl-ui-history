import { IQuality } from "types/qualities";

interface IQualityGroup {
  possessions: IQuality[];
}

export default function createQualities(qualityGroups: IQualityGroup[]) {
  return qualityGroups.reduce(reduceFn, []);

  function reduceFn(acc: IQuality[], { possessions }: IQualityGroup) {
    return [...acc, ...possessions];
  }
}

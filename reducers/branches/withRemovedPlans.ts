import { IBranch } from "types/storylet";

export default function withRemovedPlans(
  branches: IBranch[],
  { branchId }: { branchId: number }
) {
  return branches.reduce(maybeRemovePlan, []);

  function maybeRemovePlan(acc: IBranch[], next: IBranch): IBranch[] {
    if (next.id === branchId) {
      return [...acc, { ...next, planState: undefined }];
    }
    return [...acc, next];
  }
}

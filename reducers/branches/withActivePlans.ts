import { IBranch } from "types/storylet";

export default function withActivePlans(
  branches: IBranch[],
  { branchId }: { branchId: number }
) {
  return branches.reduce(maybeSetActive, []);

  function maybeSetActive(acc: IBranch[], next: IBranch): IBranch[] {
    if (next.id === branchId) {
      return [...acc, { ...next, planState: "Active" }];
    }
    return [...acc, next];
  }
}

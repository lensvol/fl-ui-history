import { IBranch } from "types/storylet";
import { IBranchesState } from "types/branches";

export default function parseBranches(
  state: IBranchesState,
  { storylet }: { storylet: { childBranches: IBranch[] } }
) {
  if (!storylet) {
    return state;
  }
  return {
    ...state,
    branches: storylet.childBranches,
  };
}

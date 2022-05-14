// export default props => (a, b) => {
export default function makeCompareBranches({ actions }) {
  return function compareBranches(a, b) {
    const isLocked = makeIsLocked({ actions });
    // If b is locked and a is not, then a should go first
    if (isLocked(b) && !isLocked(a)) {
      return -1;
    }

    // If a is locked and b is not, then b should go first
    if (isLocked(a) && !isLocked(b)) {
      return 1;
    }

    // Otherwise, higher orderings should precede lower orderings
    return -(a.ordering - b.ordering);
  };
}

export function makeIsLocked({ actions }) {
  return branch => !!(branch.actionCost > actions || branch.qualityLocked || branch.currencyLocked);
}

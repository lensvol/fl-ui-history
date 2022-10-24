import { createSelector } from "reselect";
import makeCompareBranches from "./makeCompareBranches";

const getActions = ({ actions: { actions } }) => actions;
const getBranches = ({ branches: { branches } }) => branches;

const inputs = [getActions, getBranches];
const output = (actions, branches) => {
  const compareBranches = makeCompareBranches({ actions });
  return [...branches].sort(compareBranches);
};

export default createSelector(inputs, output);

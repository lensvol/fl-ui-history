import { createSelector } from 'reselect';

const getQualityRequirementFromBranches = (plans) => plans.reduce((a, b) => a.concat(b.branch.qualityRequirements), []);
const getQualityIdsFromRequirements = (qualityRequirements) => qualityRequirements.reduce((acc, next) => [...acc, next.qualityId], []);
const planSelector = (plans) => [...plans.activePlans,...plans.completePlans];

export default createSelector(
    planSelector,
    items => getQualityIdsFromRequirements(getQualityRequirementFromBranches(items))
);
const getQualityRequirementFromCards = (cards) =>
  cards.reduce((a, b) => a.concat(b.qualityRequirements), []);
const getQualityIdsFromRequirements = (qualityRequirements) =>
  qualityRequirements.reduce((acc, next) => [...acc, next.qualityId], []);

export default (cards) =>
  getQualityIdsFromRequirements(getQualityRequirementFromCards(cards));

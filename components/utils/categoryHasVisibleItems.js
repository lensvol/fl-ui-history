import { normalize } from 'utils/stringFunctions';

export default function categoryHasVisibleItems({ filterString, qualities }) {
  return ({ qualities: categoryQualityIds }) => categoryQualityIds.some((id) => {
    const match = qualities.find(q => id === q.id);
    if (!match) {
      return false;
    }
    return normalize(match.name).indexOf(normalize(filterString)) >= 0;
  });
}

import { IMyselfState } from "types/myself";
import { IQuality } from "types/qualities";

export default function myselfChanged(
  state: IMyselfState,
  action: { payload: { possession: IQuality }[] }
) {
  const { categories, qualities } = state;

  const { payload } = action;

  // const newCategories = [...categories];
  // const newQualities = [...qualities];
  const newCategories = categories.map((c) => ({ ...c }));
  const newQualities = qualities.map((q) => ({ ...q }));

  payload.forEach(({ possession: updatedQuality }) => {
    // Find the quality with this updated quality's ID
    const idx = newQualities.findIndex((_) => _.id === updatedQuality.id);
    // If this is a quality we don't already have, then add it to the qualities array
    if (idx < 0) {
      newQualities.push(updatedQuality);
    } else {
      // Otherwise, merge the existing quality with this value
      newQualities[idx] = { ...newQualities[idx], ...updatedQuality };
    }

    // Look for the category for this quality by its (internal, not human-friendly) name
    const category = newCategories.find((c) =>
      c.categories.includes(updatedQuality.category)
    );
    if (!category) {
      // TODO: why is this? It looks to be an issue with SidebarAbility
      return;
    }

    // Try to find the quality in the list of qualities we know belong to this category;
    // if we don't find one, it's a new quality, so add it
    if (category.qualities.findIndex((id) => id === updatedQuality.id) < 0) {
      category.qualities.push(updatedQuality.id);
    }
  });
  return {
    ...state,
    categories: newCategories,
    qualities: newQualities,
  };
}

/**
 * Returns a border-colour string based on the properties of a given card.
 *
 * @param {*} data - An object with IsAutofire and Category keys, like a card
 */
export default function getBorderColour({ isAutofire = false, category } = {}) {
  if (isAutofire) {
    return "Autofire";
  }
  return category;
}

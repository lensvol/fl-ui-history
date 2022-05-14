

export default function playerCanAffordTransaction({
  activeItem,
  buying,
  quantities,
  sellAmount,
}) {
  const {
    cost,
    purchaseQuality,
    quality,
  } = activeItem.availability;

  // If we're buying, compare the amount of the currency that the player
  // has with the price of the item x the quantity we want to buy
  if (buying) {
    const playerCurrencyLevel = quantities[purchaseQuality.id] || 0;
    return (sellAmount * cost) <= playerCurrencyLevel;
  }

  // If we're selling, then check whether the player is trying to sell more
  // than they own
  const quantityPlayerHas = quantities[quality.id];
  return sellAmount <= quantityPlayerHas;
}
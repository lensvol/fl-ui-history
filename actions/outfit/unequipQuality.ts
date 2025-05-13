import changeEquipped from "actions/outfit/changeEquipped";

import OutfitService from "services/OutfitService";

const service = new OutfitService();

/** ----------------------------------------------------------------------------
 * UNEQUIP QUALITY
 -----------------------------------------------------------------------------*/
export default function unequipQuality(qualityId: number) {
  return changeEquipped(service.unequipQuality)(qualityId, false);
}

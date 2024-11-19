import changeEquipped from "actions/outfit/changeEquipped";

import OutfitService from "services/OutfitService";

const service = new OutfitService();

/** ----------------------------------------------------------------------------
 * EQUIP QUALITY
 -----------------------------------------------------------------------------*/

export default function equipQuality(qualityId: number) {
  return changeEquipped(service.equipQuality)(qualityId);
}

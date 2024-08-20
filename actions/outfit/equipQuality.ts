import OutfitService from "services/OutfitService";
import changeEquipped from "actions/outfit/changeEquipped";

const service = new OutfitService();

/** ----------------------------------------------------------------------------
 * EQUIP QUALITY
 -----------------------------------------------------------------------------*/

export default function equipQuality(qualityId: number) {
  return changeEquipped(service.equipQuality)(qualityId);
}

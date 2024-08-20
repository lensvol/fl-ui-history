import OutfitService from "services/OutfitService";
import changeEquipped from "actions/outfit/changeEquipped";

// const service = new MyselfService();
const service = new OutfitService();

/** ----------------------------------------------------------------------------
 * UNEQUIP QUALITY
 -----------------------------------------------------------------------------*/
export default function unequipQuality(qualityId: number) {
  return changeEquipped(service.unequipQuality)(qualityId);
}

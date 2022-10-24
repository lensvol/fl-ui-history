import OutfitService from "services/OutfitService";
import changeEquipped, {
  EquipQualityOptions,
} from "actions/outfit/changeEquipped";

// const service = new MyselfService();
const service = new OutfitService();

/** ----------------------------------------------------------------------------
 * UNEQUIP QUALITY
 -----------------------------------------------------------------------------*/
export default function unequipQuality(
  qualityId: number,
  options?: EquipQualityOptions
) {
  return changeEquipped(service.unequipQuality)(qualityId, options);
}

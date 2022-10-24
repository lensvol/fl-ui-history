import OutfitService from "services/OutfitService";
import changeEquipped, {
  EquipQualityOptions,
} from "actions/outfit/changeEquipped";

const service = new OutfitService();

/** ----------------------------------------------------------------------------
 * EQUIP QUALITY
 -----------------------------------------------------------------------------*/

export default function equipQuality(
  qualityId: number,
  options?: EquipQualityOptions
) {
  return changeEquipped(service.equipQuality)(qualityId, options);
}

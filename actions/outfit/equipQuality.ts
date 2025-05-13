import changeEquipped from "actions/outfit/changeEquipped";

import OutfitService from "services/OutfitService";

const service = new OutfitService();

/** ----------------------------------------------------------------------------
 * EQUIP QUALITY
 -----------------------------------------------------------------------------*/

export default function equipQuality(
  qualityId: number,
  shouldFetchAgents: boolean
) {
  return changeEquipped(service.equipQuality)(qualityId, shouldFetchAgents);
}

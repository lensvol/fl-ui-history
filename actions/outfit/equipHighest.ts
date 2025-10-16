import changeEquipped from "actions/outfit/changeEquipped";

import OutfitService from "services/OutfitService";

const service = new OutfitService();

export default function equipHighest(
  qualityId: number,
  shouldFetchAgents: boolean
) {
  return changeEquipped(service.equipHighest)(qualityId, shouldFetchAgents);
}

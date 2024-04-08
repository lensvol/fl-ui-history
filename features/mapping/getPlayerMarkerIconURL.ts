import { MAP_BASE_URL } from "features/mapping/constants";

export default function getPlayerMarkerIconURL(
  pinPrefix: string | undefined,
  avatarImage: string
) {
  const folder = pinPrefix ? `playermarkers/${pinPrefix}` : "playermarkers";

  return `${MAP_BASE_URL}/${folder}/${avatarImage}-player-marker.png`;
}

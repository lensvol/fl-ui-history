import { MAP_BASE_URL } from "features/mapping/constants";

export default function getSpritesheetBaseURL(subfolder: string) {
  return `${MAP_BASE_URL}/${subfolder}/spritesheets`;
}

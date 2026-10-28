import Config from "configuration";

export const DEFAULT_ICON = "placeholder2";

export type ImageType =
  | "ad"
  | "asset"
  | "cameo"
  | "card"
  | "currencies"
  | "frame"
  | "header"
  | "icon"
  | "location"
  | "lodgings"
  | "map-area-decoration"
  | "small-icon";

type ImagePathParameters = {
  icon?: string;
  type: ImageType;
};

export default function getImagePath({
  icon,
  type,
}: ImagePathParameters): string {
  // Intentionally use falsy comparison here — we want to catch empty strings too
  const imageIcon = icon || DEFAULT_ICON;

  switch (type) {
    case "ad":
      return `${Config.bucketUrl}ads/${imageIcon}.png`;

    case "asset":
      return imageIcon;

    case "cameo":
      return `${Config.imageUrl}cameos/${imageIcon}.png`;

    case "card":
      return `${Config.imageUrl}cards/${imageIcon}.png`;

    case "currencies":
      return `${Config.imageUrl}currencies/${imageIcon}.png`;

    case "frame":
      return `${Config.imageUrl}frames/${imageIcon}.png`;

    case "header":
      return `${Config.imageUrl}headers/${imageIcon}.png`;

    case "location":
      return `${Config.imageUrl}locations/${imageIcon}.jpg`;

    case "lodgings":
      return `${Config.imageUrl}lodgings/${imageIcon}.png`;

    case "map-area-decoration":
      return `${Config.bucketUrl}map/${imageIcon}.png`;

    case "small-icon":
      return `${Config.imageUrl}icons/${imageIcon}small.png`;

    case "icon":
    default:
      return `${Config.imageUrl}icons/${imageIcon}.png`;
  }
}

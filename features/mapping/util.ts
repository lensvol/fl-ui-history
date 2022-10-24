import { SpriteRecord } from "types/map";

export function isBackgroundSpriteRecord(sr: SpriteRecord) {
  return sr[0] === "background";
}

export function isUnterzeeBackgroundSpriteRecord(sr: SpriteRecord) {
  return sr[0] === "unterzee";
}

export function isForegroundSpriteRecord(sr: SpriteRecord) {
  return sr[0] === "foreground";
}

export function isSeaSpriteRecord(sr: SpriteRecord) {
  return sr[1] === "sea";
}

export function isSelectionSpriteRecord(sr: SpriteRecord) {
  return sr[1] === "selection" || sr[1] === "main-destination-selection";
}

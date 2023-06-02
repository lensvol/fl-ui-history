import { UIRestriction } from "types/myself";

/* eslint-disable import/prefer-default-export */
export const NAV_ITEMS: {
  label: string;
  value: string;
  uiRestriction?: UIRestriction;
}[] = [
  {
    label: "Story",
    value: "/",
  },
  {
    label: "Messages",
    value: "messages",
    uiRestriction: UIRestriction.Messages,
  },
  {
    label: "Myself",
    value: "myself",
  },
  {
    label: "Possessions",
    value: "possessions",
    uiRestriction: UIRestriction.Possessions,
  },
  {
    label: "Bazaar",
    value: "bazaar",
    uiRestriction: UIRestriction.EchoBazaar,
  },
  {
    label: "Fate",
    value: "fate",
    uiRestriction: UIRestriction.Fate,
  },
  {
    label: "Plans",
    value: "plans",
  },
];

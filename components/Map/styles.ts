import { CSSProperties } from "react";

export const getMapModalStyles: (fallback: boolean) => {
  overlay: CSSProperties;
  content: CSSProperties;
} = (fallbackMapPreferred: boolean) => ({
  overlay: {
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    display: "flex",
    justifyContent: "center",
  },
  content: fallbackMapPreferred
    ? {
        overflowX: "hidden",
        overflowY: "hidden",
        padding: 0,
      }
    : {},
});

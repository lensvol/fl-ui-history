import React from "react";
import { useAppSelector } from "features/app/store";
import Candle from "./Candle";
import { getContainerTop } from "./utils";

export default function ActionCandles() {
  const actions = useAppSelector((s) => s.actions.actions);
  const actionBankSize = useAppSelector((s) => s.actions.actionBankSize);

  // We want to pin the candles to the top of the sidebar, overlapping the
  // area header, so we need to set the 'top' dynamically to the height of
  // the tallest candle
  const containerTop = getContainerTop(actions, actionBankSize);

  // For EFS, return two candles (one of which may be snuffed)
  if (actionBankSize > 20) {
    return (
      <div className="candle-container" style={{ top: containerTop }}>
        <Candle actions={Math.min(actions, 20)} />
        <Candle actions={Math.max(actions - 20, 0)} right />
      </div>
    );
  }

  // For non-EFs, return a single candle
  return (
    <div className="candle-container" style={{ top: containerTop }}>
      <Candle actions={actions} />
    </div>
  );
}

ActionCandles.displayName = "ActionCandles";

import classnames from "classnames";
import React from "react";

export default function Tile({ isFetching }: { isFetching: boolean }) {
  return (
    <div
      className={classnames("card card--empty", isFetching && "card--fetching")}
    />
  );
}

Tile.displayName = "Tile";

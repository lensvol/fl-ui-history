import React from "react";

import Buttonlet from "components/Buttonlet";

import MediaSmDown from "components/Responsive/MediaSmDown";

export default function CloseButtonSmDown({
  onClick,
}: {
  onClick: () => void;
}) {
  return (
    <MediaSmDown>
      <div className="exchange-ui__close-button--sm-down">
        <Buttonlet type="close" onClick={onClick} />
      </div>
    </MediaSmDown>
  );
}

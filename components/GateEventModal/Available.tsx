import React from "react";

import Image from "components/Image/index";
import MediaMdUp from "components/Responsive/MediaMdUp";
import MediaSmDown from "components/Responsive/MediaSmDown";

import { IGateEvent } from "types/map";

interface Props {
  gateEvent: IGateEvent;
  onClick: () => void;
}

export default function Available({ gateEvent, onClick }: Props) {
  return (
    <div className="gate-event">
      <div
        style={{
          display: "flex",
        }}
      >
        <Image
          className="gate-event__image"
          icon={gateEvent.image}
          type="small-icon"
        />
        <div>
          <div
            className="gate-event__title"
            dangerouslySetInnerHTML={{ __html: gateEvent.name }}
          />
          <MediaSmDown>
            <div
              className="gate-event__teaser"
              dangerouslySetInnerHTML={{
                __html: gateEvent.mobileTeaser ?? gateEvent.teaser,
              }}
            />
          </MediaSmDown>
          <MediaMdUp>
            <div
              className="gate-event__teaser"
              dangerouslySetInnerHTML={{ __html: gateEvent.teaser }}
            />
          </MediaMdUp>
          <div className="gate-event__buttons">
            <button
              className="button button--primary button--sm gate-event__unlock-button"
              type="button"
              onClick={onClick}
            >
              Unlock
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

Available.displayName = "Available";

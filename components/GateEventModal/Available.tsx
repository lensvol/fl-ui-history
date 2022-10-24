import React from "react";
import { IGateEvent } from "types/map";
import Image from "components/Image/index";

interface Props {
  gateEvent: IGateEvent;
  onClick: () => void;
}

export default function Available({ gateEvent, onClick }: Props) {
  return (
    <div className="gate-event">
      <div style={{ display: "flex" }}>
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
          <div
            className="gate-event__teaser"
            dangerouslySetInnerHTML={{ __html: gateEvent.teaser }}
          />
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

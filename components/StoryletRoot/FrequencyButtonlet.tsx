import React, { useCallback, useMemo, useState } from "react";

import ReactModal from "react-modal";

import Buttonlet from "components/Buttonlet";
import MediaLgDown from "components/Responsive/MediaLgDown";
import MediaXlUp from "components/Responsive/MediaXlUp";

import { Distribution, Urgency } from "types/storylet";

type Props = {
  frequency?: Distribution;
  urgency?: Urgency;
};

export default function FrequencyButtonlet({ frequency, urgency }: Props) {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleRequestClose = useCallback(() => {
    setModalIsOpen(false);
  }, []);

  const showModal = useCallback(() => {
    setModalIsOpen(true);
  }, []);

  const tooltipText = useMemo(() => {
    if (urgency === "High") {
      return `This card has ${urgency} urgency`;
    }

    if (!frequency) {
      return undefined;
    }

    return `This card appears with ${humanize(frequency)} frequency`;
  }, [frequency, urgency]);

  if (!tooltipText) {
    return null;
  }

  return (
    <>
      <MediaLgDown>
        <Buttonlet type="frequency" onClick={showModal} />
        <ReactModal
          className="modal--tooltip-like__content"
          overlayClassName="modal--tooltip-like__overlay"
          isOpen={modalIsOpen}
          onRequestClose={handleRequestClose}
        >
          {tooltipText}
        </ReactModal>
      </MediaLgDown>
      <MediaXlUp>
        <Buttonlet
          type="frequency"
          onClick={() => {
            /* This no-op is necessary so that the Buttonlet component doesn't self-disable */
          }}
          tooltipData={{
            description: tooltipText,
          }}
        />
      </MediaXlUp>
    </>
  );
}

function humanize(distribution: Distribution): string {
  switch (distribution.toString()) {
    case "VeryInfrequent":
      return "Very Infrequent";

    default:
      return distribution;
  }
}

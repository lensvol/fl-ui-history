import React, { Fragment, useCallback, useState } from "react";
import ReactModal from "react-modal";

import Buttonlet from "components/Buttonlet";
import MediaXlUp from "components/Responsive/MediaXlUp";
import MediaLgDown from "components/Responsive/MediaLgDown";
import { Distribution } from "types/storylet";

type Props = {
  frequency: Distribution;
};

export default function FrequencyButtonlet({ frequency }: Props) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const handleRequestClose = useCallback(() => {
    setModalIsOpen(false);
  }, []);
  const showModal = useCallback(() => {
    setModalIsOpen(true);
  }, []);

  return (
    <Fragment>
      <MediaLgDown>
        <Buttonlet type="frequency" onClick={showModal} />
        <ReactModal
          className="modal--tooltip-like__content"
          overlayClassName="modal--tooltip-like__overlay"
          isOpen={modalIsOpen}
          onRequestClose={handleRequestClose}
        >
          {`This card appears with ${humanize(frequency)} frequency.`}
        </ReactModal>
      </MediaLgDown>
      <MediaXlUp>
        <Buttonlet
          type="frequency"
          onClick={() => {
            /* This no-op is necessary so that the Buttonlet component doesn't self-disable */
          }}
          tooltipData={{
            description: `This card appears with ${humanize(
              frequency
            )} frequency`,
          }}
        />
      </MediaXlUp>
    </Fragment>
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

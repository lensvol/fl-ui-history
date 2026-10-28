import React, { useCallback, useState } from "react";

import Image from "components/Image";
import Modal from "components/Modal";
import { buildTooltipData } from "components/SidebarQualities/utils";

import { IQuality } from "types/qualities";

import { normalize } from "utils/stringFunctions";

interface Props {
  activateButtonLabel: string;
  header: string;
  isOpen: boolean;
  qualities: IQuality[];
  onChoose: (quality: IQuality) => void;
  onRequestClose: () => void;
}

export default function QualityPicker({
  activateButtonLabel,
  header,
  isOpen,
  qualities,
  onChoose,
  onRequestClose,
}: Props) {
  const [filterString, setFilterString] = useState("");

  const handleClick = useCallback(
    (item: IQuality) => {
      onChoose(item);
      onRequestClose();
    },
    [onChoose, onRequestClose]
  );

  const handleFilterStringChange = useCallback((evt: any) => {
    setFilterString(evt.target.value);
  }, []);

  return (
    <Modal
      className="modal-dialog--quality-picker"
      isOpen={isOpen}
      onRequestClose={onRequestClose}
    >
      <div className="quality-picker">
        <h1 className="heading heading--3">{header}</h1>

        <input
          className="form__control"
          onChange={handleFilterStringChange}
          placeholder="Search"
          type="text"
          value={filterString}
        />

        <div className="quality-picker__items">
          {qualities
            .filter(
              (q) => normalize(q.name).indexOf(normalize(filterString)) >= 0
            )
            .map((item) => (
              <div
                className="icon icon--inventory quality-picker__item"
                key={item.id}
              >
                <Image
                  alt={item.nameAndLevel || item.name}
                  height={50}
                  icon={item.image}
                  onClick={() => handleClick(item)}
                  style={{
                    cursor: "pointer",
                    imageRendering: "auto",
                  }}
                  tooltipData={{
                    ...buildTooltipData(item),
                    smallButtons: [
                      {
                        action: () => handleClick(item),
                        label: activateButtonLabel,
                      },
                    ],
                  }}
                  type="small-icon"
                  width={50}
                />
              </div>
            ))}
        </div>
      </div>
    </Modal>
  );
}

QualityPicker.displayName = "QualityPicker";

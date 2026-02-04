import React, { useCallback, useEffect, useRef, useState } from "react";

import classnames from "classnames";

import QualityRequirements from "components/Branch/QualityRequirements";
import StoryletCard from "components/common/StoryletCard";
import StoryletDescription from "components/common/StoryletDescription";
import StoryletTitle from "components/common/StoryletTitle";
import Modal from "components/Modal";
import qreqsNeedClear from "components/utils/qreqsNeedClear";

import { ICard } from "types/cards";

type Props = {
  card: ICard;
  isOpen: boolean;
  onRequestClose: () => void;
};

export default function LockedCardModal({
  card,
  isOpen,
  onRequestClose,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [forceClearQreqs, setForceClearQreqs] = useState(false);

  const onResize = useCallback(() => {
    if (!ref.current) {
      return;
    }

    setForceClearQreqs(qreqsNeedClear(ref.current));
  }, []);

  useEffect(() => {
    window.addEventListener("resize", onResize);

    onResize();

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [onResize]);

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <div
        className="branch branch__card media--branch media--locked"
        data-branch-id={card.eventId}
        ref={ref}
      >
        <div className="media__left branch__left">
          <StoryletCard
            className="branch__card"
            defaultCursor
            image={card.image}
            imageHeight={100}
            imageWidth={78}
            name={card.name}
          />
        </div>
        <div
          className={classnames(
            "media__body branch__body",
            forceClearQreqs && "branch__body--force-clear-qreqs"
          )}
        >
          <div>
            <StoryletTitle name={card.name} className="branch__title" />
            <StoryletDescription text={card.teaser} />
          </div>
          {/*
            If the screen is wide enough to keep qreqs to the right,
            then render them inside the body
          */}
          {!forceClearQreqs && (
            <>
              <div className="buttons storylet__buttons">
                <QualityRequirements requirements={card.qualityRequirements} />
              </div>
            </>
          )}
        </div>
        {/*
            If we need to drop the qreqs below the body to fit on fewer lines,
            then render them here instead
        */}
        {forceClearQreqs && (
          <div
            className="storylet__buttons--force-clear"
            style={{
              width: "100%",
            }}
          >
            <div className="buttons storylet__buttons">
              <QualityRequirements requirements={card.qualityRequirements} />
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

LockedCardModal.displayName = "LockedCardModal";

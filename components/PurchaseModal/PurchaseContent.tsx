import React, { useCallback, useState } from "react";
import classnames from "classnames";
import { purchaseItem } from "actions/fate";
import PurchaseResult from "components/PurchaseModal/PurchaseResult";
import { connect } from "react-redux";
import MetaBlurb from "components/Fate/MetaBlurb";
import { Success } from "services/BaseMonadicService";
import { IFateCard } from "types/fate";
import { FateCardImage } from "components/Fate/FateCard";
import FateCardTitleAndByline from "components/Fate/FateCard/FateCardTitleAndByline";
import Loading from "components/Loading";

enum PurchaseContentStep {
  Ready,
  Success, // eslint-disable-line no-shadow
}

export function PurchaseContent({
  card,
  dispatch,
  onClickToClose,
}: {
  card: IFateCard | undefined;
  dispatch: Function; // eslint-disable-line
  onClickToClose: () => void;
}) {
  const [currentStep, setCurrentStep] = useState(PurchaseContentStep.Ready);
  const [responseMessage, setResponseMessage] = useState<string | undefined>(
    undefined
  );
  const [isWorking, setIsWorking] = useState(false);

  const handlePurchase = useCallback(async () => {
    if (!card) {
      return;
    }

    const { id } = card;

    setIsWorking(true);

    const result = await dispatch(
      purchaseItem({
        storeItemId: id,
      })
    );

    let message;
    if (result instanceof Success) {
      ({ message } = result.data);
      setCurrentStep(PurchaseContentStep.Success);
    } else {
      ({ message } = result);
    }
    setResponseMessage(message);
  }, [card, dispatch]);

  if (!card) {
    return null;
  }

  switch (currentStep) {
    case PurchaseContentStep.Success:
      return (
        <PurchaseContentSuccess
          card={card}
          message={responseMessage ?? ""}
          onClick={onClickToClose}
        />
      );
    case PurchaseContentStep.Ready:
    default:
      return (
        <PurchaseContentReady
          card={card}
          isWorking={isWorking}
          onClick={handlePurchase}
        />
      );
  }
}

export default connect()(PurchaseContent);

function PurchaseContentSuccess({
  card,
  message,
  onClick,
}: {
  card: IFateCard;
  message: string;
  onClick: () => void;
}) {
  const { image, name } = card;
  return (
    <PurchaseResult
      image={image}
      name={name}
      onClick={onClick}
      message={message}
      isSuccess
    />
  );
}

function PurchaseContentReady({
  card,
  isWorking,
  onClick,
}: {
  card: IFateCard;
  isWorking: boolean;
  onClick: () => void;
}) {
  const { canAfford, description, fanFavourite, price } = card;

  return (
    <div className="media dialog__media">
      <div className="media__content">
        <div className="media__left">
          <div>
            <FateCardImage {...card} />
          </div>
        </div>
        <div className="media__body">
          <div style={{ marginBottom: "1rem" }}>
            <FateCardTitleAndByline {...card} story forceBreaks noReleaseDate />
          </div>
          <p dangerouslySetInnerHTML={{ __html: description }} />
          <MetaBlurb card={card} />
          {fanFavourite && (
            <div style={{ position: "relative" }}>
              <div
                style={{
                  left: "-32px",
                  position: "absolute",
                  top: "-13px",
                }}
              >
                <span className="fl-ico fl-ico-2x fl-ico-star fan-favourite__icon" />
              </div>
              <p style={{ fontStyle: "italic" }}>
                This story is a fan favourite!
              </p>
            </div>
          )}
        </div>
        <hr />
      </div>
      <div className="dialog__actions">
        <button
          type="button"
          className={classnames(
            "button button--secondary",
            !canAfford && "button--disabled"
          )}
          onClick={onClick}
          disabled={!canAfford}
        >
          {isWorking ? (
            <Loading spinner small />
          ) : (
            <span>Purchase ({price} Fate)</span>
          )}
        </button>
      </div>
    </div>
  );
}

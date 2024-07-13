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
import Subscription from "components/Fate/Subscription";
import { PremiumSubscriptionType } from "types/subscription";

enum PurchaseContentStep {
  Ready,
  Success, // eslint-disable-line no-shadow
}

export function PurchaseContent({
  card,
  dispatch,
  enableSubscriptionModal,
  hasSubscription,
  onClickToClose,
  remainingStoryUnlocks,
  renewDate,
  subscriptionType,
}: {
  card: IFateCard | undefined;
  dispatch: Function; // eslint-disable-line
  enableSubscriptionModal?: boolean;
  hasSubscription?: boolean;
  onClickToClose: () => void;
  remainingStoryUnlocks?: number;
  renewDate?: string;
  subscriptionType?: PremiumSubscriptionType;
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
        action: card.action,
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
          remainingStoryUnlocks={remainingStoryUnlocks}
        />
      );
    case PurchaseContentStep.Ready:
    default:
      return (
        <PurchaseContentReady
          card={card}
          enableSubscriptionModal={enableSubscriptionModal ?? false}
          hasSubscription={hasSubscription ?? false}
          isWorking={isWorking}
          onClick={handlePurchase}
          remainingStoryUnlocks={remainingStoryUnlocks}
          renewDate={renewDate}
          subscriptionType={subscriptionType}
        />
      );
  }
}

export default connect()(PurchaseContent);

function PurchaseContentSuccess({
  card,
  message,
  onClick,
  remainingStoryUnlocks,
}: {
  card: IFateCard;
  message: string;
  onClick: () => void;
  remainingStoryUnlocks?: number;
}) {
  const { image, name, type } = card;

  const isEnhancedStoryUnlock = card.action === "EnhancedUnlock";
  const isEnhancedStoryReset = isEnhancedStoryUnlock && type === "ResetStory";

  return (
    <PurchaseResult
      image={image}
      name={name}
      onClick={onClick}
      message={message}
      isSuccess
      isStoryUnlock={isEnhancedStoryUnlock}
      remainingStoryUnlocks={
        isEnhancedStoryReset ? (remainingStoryUnlocks ?? 0) : undefined
      }
    />
  );
}

function PurchaseContentReady({
  card,
  enableSubscriptionModal,
  hasSubscription,
  isWorking,
  onClick,
  remainingStoryUnlocks,
  renewDate,
  subscriptionType,
}: {
  card: IFateCard;
  enableSubscriptionModal: boolean;
  hasSubscription: boolean;
  isWorking: boolean;
  onClick: () => void;
  remainingStoryUnlocks?: number;
  renewDate?: string;
  subscriptionType?: PremiumSubscriptionType;
}) {
  const { canAfford, description, fanFavourite, price, action } = card;

  const isEnhancedStoryUnlock = action === "EnhancedUnlock";
  const isDisabled =
    (!isEnhancedStoryUnlock && !canAfford) ||
    (isEnhancedStoryUnlock && (remainingStoryUnlocks ?? 0) < 0);

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
          {isEnhancedStoryUnlock &&
            !isDisabled &&
            card.type === "ResetStory" && (
              <>
                <p
                  style={{
                    fontStyle: "bold",
                  }}
                >
                  {remainingStoryUnlocks === 0 ? (
                    <>This will be your second and final replay this month.</>
                  ) : (
                    <>
                      Choosing this story will leave you with one further replay
                      this month.
                    </>
                  )}
                </p>
              </>
            )}
        </div>
        <hr />
      </div>
      <div className="dialog__actions">
        {isEnhancedStoryUnlock &&
        enableSubscriptionModal &&
        (remainingStoryUnlocks ?? 0) < 0 ? (
          <>
            <Subscription
              hasSubscription={hasSubscription}
              renewDate={renewDate}
              showButtonOnly
              subscriptionType={subscriptionType}
            />
          </>
        ) : (
          <>
            <button
              type="button"
              className={classnames(
                "button",
                isEnhancedStoryUnlock ? "button--ef" : "button--secondary",
                isDisabled && "button--disabled"
              )}
              onClick={onClick}
              disabled={isDisabled}
            >
              {isWorking ? (
                <Loading spinner small />
              ) : (
                <span>
                  {isEnhancedStoryUnlock ? (
                    <>Choose</>
                  ) : (
                    <>Purchase ({price} Fate)</>
                  )}
                </span>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

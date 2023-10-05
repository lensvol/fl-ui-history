import React from "react";

import Image from "components/Image";
import { ImageType } from "utils/getImagePath";

type Props = {
  image: string;
  isFree?: boolean;
  isSuccess?: boolean;
  message: string;
  name: string;
  onClick: () => void;
  type?: ImageType;
  isActionRefresh?: boolean;
  isStoryUnlock?: boolean;
  remainingStoryUnlocks?: number;
};

export default function PurchaseResult({
  image,
  isFree,
  isSuccess,
  message,
  name,
  onClick,
  type,
  isActionRefresh,
  isStoryUnlock,
  remainingStoryUnlocks,
}: Props) {
  const showTitle = !(isActionRefresh ?? false); // improve
  const showSubtitle = !(isStoryUnlock ?? false); // improve
  const isPurchase = !(isStoryUnlock ?? false); // improve
  const isEnhancedStoryReset =
    isStoryUnlock && remainingStoryUnlocks !== undefined; // improve

  return (
    <div className="media dialog__media">
      <div className="media__content">
        <div className="media__left">
          <div>
            <Image
              className="media__object"
              icon={image}
              alt={name}
              width={78}
              height={100}
              type={type || "icon"}
            />
          </div>
        </div>
        <div className="media__body">
          {showTitle && (
            <>
              <h2 className="heading heading--2 heading--inverse media__heading">
                {isPurchase && "Purchase"}{" "}
                {isSuccess ?? false ? "Success!" : "Failure."}
              </h2>
              <hr />
            </>
          )}

          {showSubtitle && (
            <>
              <h3 className="heading heading--3 heading--inverse">
                {isActionRefresh ? (
                  <>Actions {!isSuccess && "not"} refreshed.</>
                ) : isSuccess && !isFree ? (
                  <>Fate deducted.</>
                ) : (
                  <>No Fate has been deducted.</>
                )}
              </h3>
            </>
          )}

          <p dangerouslySetInnerHTML={{ __html: message }} />

          {isEnhancedStoryReset && (
            <>
              <div
                style={{
                  fontWeight: "bold",
                }}
              >
                {remainingStoryUnlocks === 0 ? (
                  <>You may replay one further story this month.</>
                ) : (
                  <>This will be your second and final replay this month.</>
                )}
              </div>
            </>
          )}
        </div>
        <hr />
        <div className="dialog__actions">
          <button
            className="button button--primary"
            onClick={onClick}
            type="button"
          >
            Ok
          </button>
        </div>
      </div>
    </div>
  );
}

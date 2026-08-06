import React, { useMemo } from "react";

import classnames from "classnames";

import Image from "components/Image";
import Loading from "components/Loading";

type Props = {
  avatar?: string;
  fateCost: number;
  isFree: boolean;
  isSubmitting: boolean;
  onConfirm: () => void;
};

export default function ConfirmModalReady({
  avatar,
  fateCost,
  isFree,
  isSubmitting,
  onConfirm,
}: Props) {
  const buttonLabel = useMemo(() => {
    if (isSubmitting) {
      return <Loading spinner small />;
    }

    if (isFree) {
      return <span>Change</span>;
    }

    return <span>Change ({fateCost} Fate)</span>;
  }, [fateCost, isFree, isSubmitting]);

  return (
    <div>
      <h3 className="heading heading--2">Change your face?</h3>

      <hr />

      <div className="media dialog__media">
        <div className="media__content">
          <div className="media__left">
            <div>
              <Image
                alt={avatar}
                className="media__object"
                height={100}
                icon={avatar}
                type="cameo"
                width={78}
              />
            </div>
          </div>

          <div className="media__body">
            <p>Are you sure?</p>
            {isFree ? (
              <p className="descriptive">
                Changing your face is free, just this once.
              </p>
            ) : (
              <p className="descriptive">
                This will immediately deduct {fateCost} Fate.
              </p>
            )}
          </div>

          <hr />
        </div>

        <div className="dialog__actions">
          <button
            className={classnames(
              "button",
              isFree ? "button--primary" : "button--secondary"
            )}
            disabled={isSubmitting}
            onClick={onConfirm}
            type="button"
          >
            {buttonLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

ConfirmModalReady.displayName = "ConfirmModalReady";

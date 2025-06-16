import React, { useCallback } from "react";

import { resetChronograph, toggleChronograph } from "actions/actions";

import Buttonlet from "components/Buttonlet";
import Image from "components/Image";

import Config from "configuration";

import { useAppDispatch, useAppSelector } from "features/app/store";

export default function Chronograph() {
  const dispatch = useAppDispatch();

  const isLive =
    Config.environment !== "local" && Config.environment !== "staging";
  const isAdmin = useAppSelector(
    (state) => state.user.privilegeLevel === "Admin"
  );
  const actionCount = useAppSelector(
    (state) => state.actions.chronograph.actionCount
  );

  const onReset = useCallback(() => {
    dispatch(resetChronograph());
  }, [dispatch]);

  const dismiss = useCallback(() => {
    dispatch(toggleChronograph());
  }, [dispatch]);

  if (isLive && !isAdmin) {
    return null;
  }

  return (
    <div className="chronograph-container">
      <div className="chronograph-content">
        <Buttonlet
          classNames={{
            containerClassName: "chronograph-close-button",
          }}
          onClick={dismiss}
          type="close"
        />
        <div className="chronograph-header">
          <Image icon="clock2" type="small-icon" height={40} width={40} />
          <div className="heading heading--2">Action Counter</div>
        </div>
        <div className="chronograph-body">
          <span>Elapsed actions: {actionCount.toLocaleString("en-GB")}</span>

          <button
            className="button button--primary button--small card__discard-button"
            onClick={onReset}
            type="button"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

Chronograph.displayName = "Chronograph";

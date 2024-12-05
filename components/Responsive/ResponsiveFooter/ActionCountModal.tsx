import React, { Fragment, useMemo } from "react";

import ReactModal from "react-modal";

import { Link, RouteComponentProps, withRouter } from "react-router-dom";

import classnames from "classnames";

import moment from "moment";

import { useAppSelector } from "features/app/store";

import { UIRestriction } from "types/myself";

export function ActionCountModal({ isOpen, onRequestClose }: Props) {
  const actions = useAppSelector((state) => state.actions.actions);
  const actionBankSize = useAppSelector(
    (state) => state.actions.actionBankSize
  );
  const cardsCount = useAppSelector((state) => state.cards.cardsCount);
  const deckSize = useAppSelector((state) => state.cards.deckSize);
  const handSize = useAppSelector((state) => state.cards.handSize);
  const remainingTime = useAppSelector((state) => state.timer.remainingTime);
  const setting = useAppSelector((state) => state.map.setting);
  const currentFate = useAppSelector((state) => state.fate.data.currentFate);

  const showFateUI = useAppSelector(
    (state) =>
      !state.myself.uiRestrictions?.find(
        (restriction) => restriction === UIRestriction.Fate
      )
  );

  // @ts-ignore
  const duration = moment
    .duration(remainingTime)
    .format("m:ss", { trim: false });

  const willBeEligibleForMoreSoon =
    actions < actionBankSize || cardsCount < handSize;

  const cardsAvailableString = useMemo(() => {
    if (setting?.isInfiniteDraw || cardsCount > deckSize) {
      return "No draw limit.";
    }

    return `${cardsCount} opportunity card${cardsCount === 1 ? "" : "s"} available`;
  }, [cardsCount, deckSize, setting]);

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="action-count-modal"
      overlayClassName={classnames(
        "modal--tooltip-like__overlay",
        "modal__overlay--has-dark-backdrop",
        "modal__overlay--has-transition",
        "u-align-items-start"
      )}
      shouldCloseOnOverlayClick={false}
    >
      <Fragment>
        <div>
          <h1
            className="heading heading--1"
            style={{
              textAlign: "center",
            }}
          >
            Actions and opportunity cards
          </h1>
          <div>
            <div className="action-count-modal__count">
              <i className="fl-ico fl-ico-2x fl-ico-actions action-count-modal__icon" />
              <span>
                {`${actions} action${actions === 1 ? "" : "s"} available`}
              </span>
            </div>
            <div className="action-count-modal__count">
              <i className="fl-ico fl-ico-2x fl-ico-deck action-count-modal__icon" />
              <span>{cardsAvailableString}</span>
            </div>
            <div className="action-count-modal__count">
              <i className="fl-ico fl-ico-2x fl-ico-fate action-count-modal__icon" />
              <span>{currentFate.toLocaleString("en-GB")} Fate available</span>
            </div>
          </div>
          {willBeEligibleForMoreSoon && (
            <div className="action-count-modal__next-action-container">
              <div>You will be eligible for more in</div>
              <div className="action-count-modal__next-action-time">
                {duration}
              </div>
              {showFateUI && (
                <Link className="button button--secondary" to="/fate">
                  Buy actions and cards
                </Link>
              )}
            </div>
          )}
        </div>
        <div className="action-count-modal__close-button-container">
          <button
            className="action-count-modal__close-button"
            onClick={onRequestClose}
            type="button"
          >
            <i className="fa fa-lg fa-fw fa-icon fa-close" />
          </button>
        </div>
      </Fragment>
    </ReactModal>
  );
}

type Props = RouteComponentProps & {
  isOpen: boolean;
  onRequestClose: () => void;
};

export default withRouter(ActionCountModal);

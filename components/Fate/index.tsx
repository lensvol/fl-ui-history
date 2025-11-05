import React, { useCallback, useState, PropsWithChildren } from "react";

import { useDispatch } from "react-redux";

import classnames from "classnames";

import { setFateSubtab } from "actions/fate";

import ActionRefreshContext from "components/ActionRefreshContext";
import GameplayTab from "components/Fate/GameplayTab";
import Header from "components/Fate/Header";
import OtherGamesTab from "components/Fate/OtherGamesTab";
import PurchaseStoriesTab from "components/Fate/PurchaseStoriesTab";
import ResetStoriesTab from "components/Fate/ResetStoriesTab";
import StoryletMenu from "components/Fate/Subscription/StoryletMenu";
import Modal from "components/Modal";
import PurchaseModal from "components/PurchaseModal";
import PurchaseContent from "components/PurchaseModal/PurchaseContent";

import { PURCHASE_CONTENT } from "constants/fate";

import { useAppSelector } from "features/app/store";

import {
  IFateCard,
  FateSubtab,
  SUBTAB_GAMEPLAY,
  SUBTAB_RESET,
  SUBTAB_NEW,
  SUBTAB_OTHER,
} from "types/fate";

export default function Fate() {
  const dispatch = useDispatch();

  const activeSubtab = useAppSelector((state) => state.fate.activeSubtab);
  const data = useAppSelector((state) => state.fate.data);
  const hasSubscription = useAppSelector(
    (state) => state.settings.subscriptions.hasBraintreeSubscription
  );
  const renewDate = useAppSelector(
    (state) => state.subscription.data?.renewDate
  );
  const subscriptionType = useAppSelector(
    (state) => state.settings.subscriptions.subscriptionType
  );

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isPurchaseContentModalOpen, setIsPurchaseContentModalOpen] =
    useState(false);
  const [selectedFateCard, setSelectedFateCard] = useState<
    IFateCard | undefined
  >(undefined);

  const setActiveTab = useCallback(
    (subtab: FateSubtab) => {
      dispatch(setFateSubtab(subtab));
    },
    [dispatch]
  );

  const handleClickFateCard = useCallback((fateCard: IFateCard) => {
    setSelectedFateCard(fateCard);

    if (fateCard.action === PURCHASE_CONTENT) {
      setIsPurchaseContentModalOpen(true);

      return;
    }

    setIsConfirmModalOpen(true);
  }, []);

  const handleRequestClosePurchaseContentModal = useCallback(() => {
    setIsPurchaseContentModalOpen(false);
  }, []);

  return (
    <ActionRefreshContext.Consumer>
      {({ onOpenPurchaseFateModal }) => (
        <>
          <div>
            <div className="fate-header">
              <div className="fate-header__text">
                <h1 className="heading heading--1">
                  You have {data.currentFate.toLocaleString("en-GB")} Fate
                  Points
                </h1>
                <p className="col-2-of-3 lede">
                  Buy Fate to get premium content, extra storylines or faster
                  progression.
                </p>
              </div>
              <button
                className="button button--secondary fate-header__button"
                onClick={onOpenPurchaseFateModal}
                type="button"
              >
                Buy fate
              </button>
            </div>

            <StoryletMenu enhancedPlacement={true} />

            <Header
              data={data}
              hasSubscription={hasSubscription}
              renewDate={renewDate}
              subscriptionType={subscriptionType}
            />
          </div>

          <div className="inner-tabs--fate" role="tablist">
            <Tab
              activeTab={activeSubtab}
              onClick={setActiveTab}
              subtabType={SUBTAB_NEW}
            >
              <i className="fl-ico-story inner-tab__icon--fate" />
              <div className="inner-tab__label--fate">Purchase Stories</div>
            </Tab>

            <Tab
              activeTab={activeSubtab}
              onClick={setActiveTab}
              subtabType={SUBTAB_RESET}
            >
              <i className="fl-ico-star inner-tab__icon--fate" />
              <div className="inner-tab__label--fate">Reset Stories</div>
            </Tab>

            <div id="inner-tab-separator" />

            <Tab
              activeTab={activeSubtab}
              onClick={setActiveTab}
              subtabType={SUBTAB_GAMEPLAY}
            >
              <i className="fl-ico-deck inner-tab__icon--fate" />
              <div className="inner-tab__label--fate">Gameplay</div>
            </Tab>

            <Tab
              activeTab={activeSubtab}
              onClick={setActiveTab}
              subtabType={SUBTAB_OTHER}
            >
              <i className="fl-ico-logo inner-tab__icon--fate" />
              <div className="inner-tab__label--fate">Other Games</div>
            </Tab>
          </div>

          <GameplayTab
            active={activeSubtab === SUBTAB_GAMEPLAY}
            onClick={handleClickFateCard}
          />
          <PurchaseStoriesTab
            active={activeSubtab === SUBTAB_NEW}
            onClick={handleClickFateCard}
          />
          <ResetStoriesTab
            active={activeSubtab === SUBTAB_RESET}
            onClick={handleClickFateCard}
          />
          <OtherGamesTab active={activeSubtab === SUBTAB_OTHER} />

          <PurchaseModal
            data={selectedFateCard}
            isOpen={isConfirmModalOpen}
            onRequestClose={() => setIsConfirmModalOpen(false)}
          />

          <Modal
            isOpen={isPurchaseContentModalOpen}
            onRequestClose={handleRequestClosePurchaseContentModal}
          >
            <PurchaseContent
              card={selectedFateCard}
              onClickToClose={handleRequestClosePurchaseContentModal}
            />
          </Modal>
        </>
      )}
    </ActionRefreshContext.Consumer>
  );
}

Fate.displayName = "Fate";

function Tab({
  activeTab,
  border,
  children,
  onClick,
  subtabType,
}: PropsWithChildren<{
  activeTab: FateSubtab;
  border?: boolean;
  onClick: (subtab: FateSubtab) => void;
  subtabType: FateSubtab;
}>) {
  return (
    <button
      aria-selected={activeTab === subtabType}
      className={classnames(
        "inner-tab--fate",
        border && "inner-tab--with-border",
        activeTab === subtabType && "inner-tab--active"
      )}
      onClick={() => onClick(subtabType)}
      role="tab"
      type="button"
    >
      {children}
    </button>
  );
}

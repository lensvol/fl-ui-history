import Modal from "components/Modal";
import PurchaseContent from "components/PurchaseModal/PurchaseContent";
import { PURCHASE_CONTENT } from "constants/fate";
import React, { useCallback, useState, PropsWithChildren } from "react";
import { connect } from "react-redux";
import classnames from "classnames";

import { setFateSubtab } from "actions/fate";
import PurchaseModal from "components/PurchaseModal";
import { IAppState } from "types/app";
import {
  IFateCard,
  FateSubtab,
  SUBTAB_GAMEPLAY,
  SUBTAB_RESET,
  SUBTAB_NEW,
} from "types/fate";
import ActionRefreshContext from "components/ActionRefreshContext";
import PurchaseStoriesTab from "./PurchaseStoriesTab";
import GameplayTab from "./GameplayTab";
import ResetStoriesTab from "./ResetStoriesTab";
import Header from "./Header";

function Fate({ activeSubtab, data, dispatch }: Props) {
  // const [activeTab, setActiveTab] = useState<FateSubtab>(SUBTAB_GAMEPLAY);
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
                  You have {data.currentFate} Fate Points
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
            <Header data={data} />
            <hr style={{ marginBottom: ".5rem" }} />
          </div>

          <div className="inner-tabs" role="tablist">
            <Tab
              activeTab={activeSubtab}
              onClick={setActiveTab}
              subtabType={SUBTAB_GAMEPLAY}
              border
            >
              <i className="fl-ico fl-ico-2x fl-ico-deck inner-tab__icon inner-tab__icon--fate" />
              <span className="inner-tab__label inner-tabe__label--fate">
                Gameplay
              </span>
            </Tab>

            <Tab
              activeTab={activeSubtab}
              onClick={setActiveTab}
              subtabType={SUBTAB_NEW}
              border
            >
              <i className="fl-ico fl-ico-2x fl-ico-story inner-tab__icon inner-tab__icon--fate" />
              <span className="inner-tab__label inner-tab__label--fate">
                Purchase Stories
              </span>
            </Tab>

            <Tab
              activeTab={activeSubtab}
              onClick={setActiveTab}
              subtabType={SUBTAB_RESET}
            >
              <i className="fl-ico fl-ico-2x fl-ico-star inner-tab__icon inner-tab__icon--fate inner-tab__icon--star" />
              <span className="inner-tab__label inner-tab__label--fate">
                Reset Stories
              </span>
            </Tab>
          </div>

          <GameplayTab
            active={activeSubtab === "gameplay"}
            onClick={handleClickFateCard}
          />
          <PurchaseStoriesTab
            active={activeSubtab === "new"}
            onClick={handleClickFateCard}
          />
          <ResetStoriesTab
            active={activeSubtab === "reset"}
            onClick={handleClickFateCard}
          />

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

const mapStateToProps = (state: IAppState) => {
  const {
    fate: { activeSubtab, data },
  } = state;
  return { activeSubtab, data };
};

type Props = ReturnType<typeof mapStateToProps> & {
  dispatch: Function; // eslint-disable-line
};

export default connect(mapStateToProps)(Fate);

function Tab({
  activeTab,
  children,
  subtabType,
  onClick,
  border,
}: PropsWithChildren<{
  activeTab: FateSubtab;
  border?: boolean;
  subtabType: FateSubtab;
  onClick: (subtab: FateSubtab) => void;
}>) {
  return (
    <button
      className={classnames(
        "inner-tab",
        "inner-tab--fate",
        border && "inner-tab--with-border inner-tab--with-border--fate",
        activeTab === subtabType && "inner-tab--active"
      )}
      onClick={() => onClick(subtabType)}
      role="tab"
      aria-selected={activeTab === subtabType}
      type="button"
    >
      {children}
    </button>
  );
}

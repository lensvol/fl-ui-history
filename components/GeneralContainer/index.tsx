import React, { useCallback, useState } from "react";

import classnames from "classnames";

import ReactCSSTransitionReplace from "react-css-transition-replace";

import AccessibleSidebar from "components/AccessibleSidebar";
import ActionRefreshContext from "components/ActionRefreshContext";
import Alert from "components/Alert";
import DeckRefreshContext from "components/DeckRefreshContext";
import Footer from "components/Footer";
import { NAV_ITEMS } from "components/GeneralContainer/constants";
import CurrentAreaBanner from "components/GeneralContainer/CurrentAreaBanner";
import EnhancedRefreshModal from "components/GeneralContainer/EnhancedRefreshModal";
import PurchaseFateContext from "components/GeneralContainer/PurchaseFateContext";
import RefillOpportunityDeckModal from "components/GeneralContainer/RefillOpportunityDeckModal";
import RefreshActionsModal from "components/GeneralContainer/RefreshActionsModal";
import Header from "components/Header";
import Infobar from "components/Infobar";
import LoadingScreen from "components/LoadingScreen";
import PurchaseFateModal from "components/PurchaseFateModal";
import MediaLgDown from "components/Responsive/MediaLgDown";
import MediaMdDown from "components/Responsive/MediaMdDown";
import MediaMdUp from "components/Responsive/MediaMdUp";
import MediaSmDown from "components/Responsive/MediaSmDown";
import MediaXlUp from "components/Responsive/MediaXlUp";
import ResponsiveSidebar from "components/Responsive/ResponsiveSidebar/index";
import ResponsiveMenu from "components/ResponsiveMenu";
import Sidebar from "components/Sidebar";
import Tabs from "components/Tabs";

import { useAppSelector } from "features/app/store";

/**
 * This is a wrapper that contains the general app layout
 * The 'view' is passed in as a child
 */
export default function GeneralContainer({ children, sectionName }: Props) {
  const [isActionRefreshModalOpen, setIsActionRefreshModalOpen] =
    useState(false);
  const [isDeckRefreshModalOpen, setIsDeckRefreshModalOpen] = useState(false);
  const [isPurchaseFateModalOpen, setIsPurchaseFateModalOpen] = useState(false);
  const [isEnhancedRefreshModalOpen, setIsEnhancedRefreshModalOpen] =
    useState(false);

  const handleCloseActionRefreshModal = useCallback(
    () => setIsActionRefreshModalOpen(false),
    []
  );
  const handleCloseDeckRefreshModal = useCallback(
    () => setIsDeckRefreshModalOpen(false),
    []
  );
  const handleClosePurchaseFateModal = useCallback(
    () => setIsPurchaseFateModalOpen(false),
    []
  );
  const handleOpenActionRefreshModal = useCallback(
    () => setIsActionRefreshModalOpen(true),
    []
  );
  const handleOpenDeckRefreshModal = useCallback(
    () => setIsDeckRefreshModalOpen(true),
    []
  );
  const handleOpenPurchaseFateModal = useCallback(
    () => setIsPurchaseFateModalOpen(true),
    []
  );
  const handleOpenEnhancedRefreshModal = useCallback(
    () => setIsEnhancedRefreshModalOpen(true),
    []
  );
  const handleCloseEnhancedRefreshModal = useCallback(
    () => setIsEnhancedRefreshModalOpen(false),
    []
  );

  const fateData = useAppSelector((state) => state.fate.data);
  const currentArea = useAppSelector((state) => state.map.currentArea);
  const uiRestrictions = useAppSelector((state) => state.myself.uiRestrictions);

  // This is an arbitrary "have we loaded" canary
  if (!fateData.fateCards.length) {
    return <LoadingScreen />;
  }

  return (
    <ActionRefreshContext.Provider
      value={{
        onOpenActionRefreshModal: handleOpenActionRefreshModal,
        onOpenPurchaseFateModal: handleOpenPurchaseFateModal,
        onOpenEnhancedRefreshModal: handleOpenEnhancedRefreshModal,
      }}
    >
      <PurchaseFateContext.Provider
        value={{ onOpenPurchaseFateModal: handleOpenPurchaseFateModal }}
      >
        <DeckRefreshContext.Provider
          value={{ onOpenDeckRefreshModal: handleOpenDeckRefreshModal }}
        >
          <div>
            <a className="u-visually-hidden u-focusable" href="#main">
              Skip to main content
            </a>
            <AccessibleSidebar />
            <Header />

            <ReactCSSTransitionReplace
              transitionName="fade"
              transitionEnterTimeout={1000}
              transitionLeaveTimeout={1000}
            >
              <CurrentAreaBanner currentArea={currentArea} />
            </ReactCSSTransitionReplace>

            <div>
              <MediaMdDown>
                <ResponsiveMenu />
              </MediaMdDown>
              <div className="content container">
                <div className="general-container__row">
                  <Sidebar />
                  <div className="col-primary">
                    <MediaMdUp>
                      <nav className="nav nav--tabs nav--tabs--main">
                        <Tabs
                          items={NAV_ITEMS}
                          uiRestrictions={uiRestrictions}
                        />
                      </nav>
                    </MediaMdUp>
                    <div
                      id="main"
                      className={classnames(
                        "tab-content tab-content--inverse inverse--bordered",
                        sectionName && sectionName
                      )}
                      role="main"
                    >
                      <div className="tab-content__bordered-container">
                        {children}
                      </div>
                    </div>
                    <MediaMdUp>
                      <MediaLgDown>
                        <Footer />
                      </MediaLgDown>
                    </MediaMdUp>
                  </div>
                  <Infobar />
                </div>
              </div>
              <Alert />
              <MediaXlUp>
                <Footer />
              </MediaXlUp>
              <MediaSmDown>
                <Footer />
              </MediaSmDown>
            </div>
            <MediaMdDown>
              <ResponsiveSidebar />
            </MediaMdDown>
          </div>
          <RefillOpportunityDeckModal
            isOpen={isDeckRefreshModalOpen}
            onRequestClose={handleCloseDeckRefreshModal}
          />
          <RefreshActionsModal
            isOpen={isActionRefreshModalOpen}
            onRequestClose={handleCloseActionRefreshModal}
          />
          <PurchaseFateModal
            isOpen={isPurchaseFateModalOpen}
            onRequestClose={handleClosePurchaseFateModal}
          />
          <EnhancedRefreshModal
            isOpen={isEnhancedRefreshModalOpen}
            onRequestClose={handleCloseEnhancedRefreshModal}
          />
        </DeckRefreshContext.Provider>
      </PurchaseFateContext.Provider>
    </ActionRefreshContext.Provider>
  );
}

GeneralContainer.displayName = "GeneralContainer";

type Props = {
  children: React.ReactNode;
  sectionName?: string; // eslint-disable-line react/no-unused-prop-types, react/require-default-props
};

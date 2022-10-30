import PurchaseFateModal from "components/PurchaseFateModal";
import React, { useCallback, useState } from "react";
import { connect } from "react-redux";
import classnames from "classnames";

import ActionRefreshContext from "components/ActionRefreshContext";
import Header from "components/Header";
import Tabs from "components/Tabs";
import Sidebar from "components/Sidebar";
import DeckRefreshContext from "components/DeckRefreshContext";

import AccessibleSidebar from "components/AccessibleSidebar";
import Infobar from "components/Infobar";
import Footer from "components/Footer";
import LoadingScreen from "components/LoadingScreen";
import News from "components/News";

import MediaLgDown from "components/Responsive/MediaLgDown";
import MediaMdUp from "components/Responsive/MediaMdUp";
import MediaMdDown from "components/Responsive/MediaMdDown";
import MediaSmDown from "components/Responsive/MediaSmDown";
import MediaXlUp from "components/Responsive/MediaXlUp";
import ResponsiveSidebar from "components/Responsive/ResponsiveSidebar/index";

import ResponsiveMenu from "components/ResponsiveMenu";

import ReactCSSTransitionReplace from "react-css-transition-replace";

import { IAppState } from "types/app";
import getImagePath from "utils/getImagePath";
import { NAV_ITEMS } from "./constants";
import RefreshActionsModal from "./RefreshActionsModal";
import RefillOpportunityDeckModal from "./RefillOpportunityDeckModal";
import PurchaseFateContext from "./PurchaseFateContext";

/**
 * This is a wrapper that contains the general app layout
 * The 'view' is passed in as a child
 */
export function GeneralContainer({
  children,
  currentArea,
  fateData,
  sectionName,
}: Props) {
  const [isActionRefreshModalOpen, setIsActionRefreshModalOpen] =
    useState(false);
  const [isDeckRefreshModalOpen, setIsDeckRefreshModalOpen] = useState(false);
  const [isPurchaseFateModalOpen, setIsPurchaseFateModalOpen] = useState(false);

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

  const renderBanner = useCallback(() => {
    const bgImage = getImagePath({ icon: currentArea?.image, type: "header" });
    return (
      <div
        key={bgImage}
        className="banner banner--lg-up"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
    );
  }, [currentArea]);

  // This is an arbitrary "have we loaded" canary
  if (!fateData.fateCards.length) {
    return <LoadingScreen />;
  }

  return (
    <ActionRefreshContext.Provider
      value={{
        onOpenActionRefreshModal: handleOpenActionRefreshModal,
        onOpenPurchaseFateModal: handleOpenPurchaseFateModal,
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
              {currentArea && renderBanner()}
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
                        <Tabs items={NAV_ITEMS} />
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
              <News />
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
        </DeckRefreshContext.Provider>
      </PurchaseFateContext.Provider>
    </ActionRefreshContext.Provider>
  );
}

GeneralContainer.displayName = "GeneralContainer";

const mapStateToProps = ({
  actions: { actionBankSize },
  fate: { data: fateData },
  map: { currentArea },
}: IAppState) => ({
  actionBankSize, // eslint-disable-line react/no-unused-prop-types, react/require-default-props
  fateData, // eslint-disable-line react/no-unused-prop-types, react/require-default-props
  currentArea, // eslint-disable-line react/no-unused-prop-types, react/require-default-props
});

type OwnProps = {
  children: React.ReactNode;
  sectionName?: string; // eslint-disable-line react/no-unused-prop-types, react/require-default-props
};

interface Props extends OwnProps, ReturnType<typeof mapStateToProps> {}

export default connect(mapStateToProps)(GeneralContainer);

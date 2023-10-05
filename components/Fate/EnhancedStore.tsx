import React, { useCallback, useEffect, useState } from "react";

import { connect } from "react-redux";

import { useHistory } from "react-router";

import { fetch as fetchFate, toggleEnhancedStoreView } from "actions/fate";
import {
  isDowngradedSubscription,
  isRecentlyCancelledSubscription,
} from "actions/fate/subscriptions";

import finalMonth from "assets/img/LeavingThisMonth.png";
import freshlyAdded from "assets/img/NewThisMonth.png";

import classnames from "classnames";

import ActionButton from "components/ActionButton";
import { StoryletDescription } from "components/common";
import FateCard from "components/Fate/FateCard";
import Image from "components/Image";
import { ImageProps } from "components/Image/props";
import Modal from "components/Modal";
import PurchaseModal from "components/PurchaseModal";
import PurchaseContent from "components/PurchaseModal/PurchaseContent";

import { PURCHASE_CONTENT } from "constants/fate";

import getSortedVisibleFateCards from "selectors/fate/getSortedVisibleFateCards";

import { IAppState } from "types/app";
import { IFateCard } from "types/fate";

function EnhancedStore({
  data,
  dispatch,
  fateCards,
  hasSubscription,
  remainingStoryUnlocks,
  renewDate,
  subscriptionType,
}: Props) {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isPurchaseContentModalOpen, setIsPurchaseContentModalOpen] =
    useState(false);
  const [selectedFateCard, setSelectedFateCard] = useState<
    IFateCard | undefined
  >(undefined);

  // Fetch subscription on load
  useEffect(() => {
    dispatch(fetchFate());
  }, [dispatch]);

  const handleClickFateCard = useCallback(
    (fateCard: IFateCard) => {
      const originalAction = fateCard.action;
      const price = fateCard.type === "PurchaseStory" ? 2 : 1;

      setSelectedFateCard({
        ...fateCard,
        action: "EnhancedUnlock",
        price: price,
        canAfford: (remainingStoryUnlocks ?? 0) >= price,
      });

      if (originalAction === PURCHASE_CONTENT) {
        setIsPurchaseContentModalOpen(true);

        return;
      }

      setIsConfirmModalOpen(true);
    },
    [remainingStoryUnlocks]
  );

  const handleRequestClosePurchaseContentModal = useCallback(() => {
    setIsPurchaseContentModalOpen(false);
  }, []);

  const featuredCard = fateCards
    .filter((c) => c.enhancedFeaturedItem ?? false)
    .filter((c) => c.enhancedStoryAvailability === "FreshlyAdded")
    .find((c) => c);

  const title = "Revisit Fallen London's Exceptional Stories";
  const description =
    "<p>" +
    "Each month, we offer a delicious menu of six stories from the archives for our Enhanced Exceptional Friends to choose from." +
    "</p>" +
    "<p>" +
    "Enhanced Subscribers may play a story for the first time or reset two previously played stories." +
    "</p>" +
    "<p>" +
    "We refresh this menu each month, rotating out three stories and replacing them with three fresh ones. " +
    "Each story will be available for a total of two months at a time." +
    "</p>";

  const freshlyAddedBadge: ImageProps = {
    alt: "Freshly Added",
    icon: freshlyAdded,
    type: "asset",
    className: "storylet--ribbon--badge",
    tooltipData: {
      description: "Freshly Added",
    },
  };

  const finalMonthBadge: ImageProps = {
    alt: "Final Month",
    icon: finalMonth,
    type: "asset",
    className: "storylet--ribbon--badge",
    tooltipData: {
      description: "Final Month",
    },
  };

  const allStories = fateCards
    .filter((c) => (c.enhancedStoryAvailability ?? "None") !== "None")
    .map((c) => {
      return {
        ...c,
        buttonText: "Examine",
        buttonClassNames: "button--ef",
        enhancedStore: true,
        badge:
          c.enhancedStoryAvailability === "FreshlyAdded"
            ? freshlyAddedBadge
            : finalMonthBadge,
      };
    })
    .sort((a, b) => {
      if (a.id === featuredCard?.id) {
        // if 'a' is featured, 'a' *always* comes before 'b'
        return -1;
      }

      if (b.id === featuredCard?.id) {
        // if 'b' is featured, 'a' *always* comes after 'b'
        return 1;
      }

      // one is 'FreshlyAdded', the other is 'FinalMonth'; sort accordingly
      if (a.enhancedStoryAvailability !== b.enhancedStoryAvailability) {
        if (a.enhancedStoryAvailability === "FreshlyAdded") {
          // 'a' is 'FreshlyAdded', which means it *must* come before 'b', which is 'FinalMonth'
          return -1;
        }

        // 'a' is 'FinalMonth', which means it *must* come after 'b', which is 'FreshlyAdded'
        return 1;
      }

      /*
       * At this point, we know for sure that either:
       *  1. both 'a' and 'b' are 'FreshlyAdded'; or
       *  2. both 'a' and 'b' are 'FinalMonth'.
       *
       * We're going to return -1 to preserve existing order (i.e., 'a' comes before 'b')
       */
      return -1;
    });

  const newStories = allStories.filter((c) => c.type === "PurchaseStory");
  const replayStories = allStories.filter((c) => c.type === "ResetStory");

  const history = useHistory();

  const handleClickToggle = useCallback(async () => {
    dispatch(fetchFate());
    dispatch(toggleEnhancedStoreView(history));
  }, [dispatch, history]);

  const headerText =
    (remainingStoryUnlocks ?? 0) === 0
      ? "You have selected your stories for this month. Return here next month for an updated selection!"
      : remainingStoryUnlocks === 1
      ? "You may choose to reset one more story."
      : "You may choose one new story to play, or two to reset.";

  const userDidDowngrade = isDowngradedSubscription(
    hasSubscription,
    subscriptionType
  );
  const userRecentlyCancelled = isRecentlyCancelledSubscription(
    hasSubscription,
    subscriptionType
  );
  const shouldShowHeaderText =
    userDidDowngrade || subscriptionType === "EnhancedExceptionalFriendship";
  const enableSubscriptionModal =
    subscriptionType !== "EnhancedExceptionalFriendship" ||
    userDidDowngrade ||
    userRecentlyCancelled;

  return (
    <>
      <div
        className="media media--root"
        style={{
          marginBottom: "18px",
        }}
      >
        <div className="media__left">
          <div className="storylet-root__card">
            <Image
              className="media__object storylet-root__card-image"
              icon={featuredCard?.image ?? "furtivehand"}
              alt={title}
              type="icon"
              border={featuredCard?.border?.toLowerCase() ?? "Ongoing"}
              defaultCursor
            />
          </div>
          <div
            style={{
              width: "93px",
              margin: "0.5rem 8px 0",
            }}
          >
            <b>{featuredCard?.name}</b>
          </div>
        </div>
        <div className="media__body">
          <h1 className="media__heading heading heading--2 storylet-root__heading">
            {title}
          </h1>
          <StoryletDescription
            containerClassName="storylet-root__description-container"
            text={description}
          />
        </div>
      </div>
      {shouldShowHeaderText && (
        <h1
          className="media__heading heading heading--2"
          style={{
            width: "100%",
            backgroundColor: "#4a4843",
            color: "white",
            textAlign: "center",
            padding: "0.5em",
          }}
        >
          {headerText}
        </h1>
      )}
      <div>
        <h2
          className="heading heading--2"
          style={{
            margin: "1em 0 0.5em",
          }}
        >
          Play New Stories
        </h2>

        {allStories.length === 0 ? (
          <p>
            You've already unlocked all of this month's stories, but haven't
            finished them. Once you've finished a story, you can reset it here.
          </p>
        ) : (
          newStories.length === 0 && (
            <p>
              You've already played all of this month's stories. You can choose
              previously played stories to reset instead.
            </p>
          )
        )}

        {newStories.map((c) => (
          <FateCard
            key={c.id}
            data={c}
            onClick={handleClickFateCard}
            badge={c.badge}
          />
        ))}
      </div>

      <div>
        {replayStories.length > 0 && (
          <>
            <h2
              className="heading heading--2"
              style={{
                margin: "1em 0 0.5em",
              }}
            >
              Revisit Played Stories
            </h2>
          </>
        )}
        {replayStories.map((c) => (
          <FateCard
            key={c.id}
            data={c}
            onClick={handleClickFateCard}
            badge={c.badge}
          />
        ))}

        {allStories.length === 5 ? (
          <p
            className="heading heading--3"
            style={{
              margin: "1em 0 0.5em",
            }}
          >
            You already have one of this month's selection ready to play!
          </p>
        ) : (
          allStories.length < 5 &&
          allStories.length > 0 && (
            <p
              className="heading heading--3"
              style={{
                margin: "1em 0 0.5em",
              }}
            >
              You already have some of this month's selection ready to play!
            </p>
          )
        )}
      </div>

      <div
        className={classnames(
          "buttons buttons--left buttons--storylet-exit-options"
        )}
      >
        <ActionButton
          go
          data={{
            ...data,
            buttonClassNames: "button--ef",
          }}
          onClick={handleClickToggle}
        >
          <i className="fa fa-arrow-left" /> Perhaps not
        </ActionButton>
      </div>

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
          enableSubscriptionModal={enableSubscriptionModal}
          hasSubscription={hasSubscription}
          onClickToClose={handleRequestClosePurchaseContentModal}
          renewDate={renewDate}
          remainingStoryUnlocks={
            (remainingStoryUnlocks ?? 0) - (selectedFateCard?.price ?? 0)
          }
          subscriptionType={subscriptionType}
        />
      </Modal>
    </>
  );
}

EnhancedStore.displayName = "EnhancedStore";

const mapStateToProps = (state: IAppState) => ({
  activeSubtab: state.fate.activeSubtab,
  data: state.fate.data,
  fateCards: getSortedVisibleFateCards(state),
  hasSubscription: state.settings.subscriptions.hasBraintreeSubscription,
  remainingStoryUnlocks:
    state.fate.remainingStoryUnlocks ??
    state.settings.subscriptions.remainingStoryUnlocks,
  renewDate: state.subscription.data?.renewDate,
  subscriptionType: state.settings.subscriptions.subscriptionType,
});

type Props = ReturnType<typeof mapStateToProps> & {
  dispatch: Function; // eslint-disable-line
};

export default connect(mapStateToProps)(EnhancedStore);

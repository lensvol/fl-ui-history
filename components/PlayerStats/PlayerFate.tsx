import TippyWrapper from "components/TippyWrapper";
import React, { useCallback } from "react";
import { withRouter, Link, RouteComponentProps } from "react-router-dom";
import { connect, useDispatch } from "react-redux";

import { openPurchaseDialog } from "actions/fate";
import { closeSidebar } from "actions/sidebar";
import Image from "components/Image";
import getPremiumDaysRemaining from "selectors/fate/getPremiumDaysRemaining";
import { IAppState } from "types/app";
import { UIRestriction } from "types/myself";

const mapStateToProps = (state: IAppState) => {
  const {
    actions: { actions },
    fate: {
      isExceptionalFriend,
      data: { currentFate, fateCards },
    },
    myself: { uiRestrictions },
  } = state;

  return {
    actions,
    currentFate,
    fateCards,
    isExceptionalFriend,
    premiumDaysRemaining: Math.max(getPremiumDaysRemaining(state), 0),
    showFateUI: !uiRestrictions?.find(
      (restriction) => restriction === UIRestriction.Fate
    ),
  };
};

type Props = ReturnType<typeof mapStateToProps> & RouteComponentProps;

function PlayerFate({
  actions,
  currentFate,
  fateCards,
  history,
  isExceptionalFriend,
  premiumDaysRemaining,
  showFateUI,
}: Props) {
  const dispatch = useDispatch();

  const handleClick = useCallback(() => {
    const actionsRemaining = actions;
    const actionItem = fateCards.find(
      ({ action }) => action === "RefillActions"
    );

    if (actionsRemaining <= 6) {
      dispatch(openPurchaseDialog(actionItem));
    } else {
      history.push("/fate");
    }
  }, [actions, dispatch, fateCards, history]);

  const renderSubscriptionInformation = useCallback(() => {
    if (isExceptionalFriend) {
      return (
        <div>
          {`${premiumDaysRemaining} day${
            premiumDaysRemaining !== 1 ? "s" : ""
          } left of Exceptional Friendship`}
        </div>
      );
    }
    return (
      <div>
        <h3>BE EXCEPTIONAL!</h3>
        <p>
          <Link onClick={closeSidebar} to="/fate">
            Subscribe for a second candle and brand new stories every month.
          </Link>
        </p>
      </div>
    );
  }, [isExceptionalFriend, premiumDaysRemaining]);

  if (!showFateUI) {
    return null;
  }

  return (
    <li className="item">
      <TippyWrapper tooltipData={{ description: "Open the Fate tab" }}>
        <button
          className="icon--currency sidebar__fate-button sidebar__button--has-focus-outline"
          onClick={handleClick}
          style={{ padding: 0 }}
          tabIndex={0}
          type="button"
        >
          <Image
            alt=""
            className="media__object"
            icon="fate"
            type="currencies"
            width={60}
            height={78}
            style={{ cursor: "pointer" }}
          />
          <span className="u-visually-hidden">Open the Fate tab</span>
        </button>
      </TippyWrapper>

      <div className="item__desc">
        <span className="js-item-name item__name">Fate</span>
        <div className="item__value">{currentFate}</div>
        {renderSubscriptionInformation()}
      </div>
    </li>
  );
}

PlayerFate.displayName = "PlayerFate";

export default withRouter(connect(mapStateToProps)(PlayerFate));

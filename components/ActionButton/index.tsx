import React, { Component, Fragment } from "react";

import { connect } from "react-redux";

import { RouteComponentProps, withRouter } from "react-router-dom";

import ButtonLabel from "components/ActionButton/components/ButtonLabel";
import FateRefreshButton from "components/ActionButton/components/FateRefreshButton";
import MainButton from "components/ActionButton/components/MainButton";
import ActionRefreshContext from "components/ActionRefreshContext";
import { IActionRefreshContextValues } from "components/ActionRefreshContext/ActionRefreshContext";

import { UI_INTEGRATION_REGEX } from "features/content-behaviour-integration/constants";

import { IAppState } from "types/app";

class ActionButton extends Component<Props & RouteComponentProps> {
  static displayName = "ActionButton";

  static defaultProps = {
    disabled: false,
    go: false,
    isWorking: false,
    suppressUnlockButton: false,
  };

  handleClick = () => {
    const { onClick } = this.props;

    if (this.isDisabled()) {
      return null;
    }

    return onClick();
  };

  isActionLocked = () => {
    // We're action-locked if we don't have enough actions for this option
    const { actions, data } = this.props;

    return data.actionCost > actions;
  };

  isDisabled = () => {
    const {
      actions,
      data: { actionCost, currencyLocked, qualityLocked },
      disabled: propDisabled,
    } = this.props;

    const actionLocked = actions < actionCost;

    return propDisabled || actionLocked || currencyLocked || qualityLocked;
  };

  render() {
    const {
      actions,
      children,
      currentFate,
      data,
      go,
      isWorking,
      suppressUnlockButton,
      remainingActionRefreshes,
    } = this.props;

    const disabled = this.isDisabled();
    const hasEnoughFate = (currentFate || 0) >= 4;
    const hasActionRefreshes = (remainingActionRefreshes || 0) !== 0;

    const uiTriggerMatches = data.description?.match(UI_INTEGRATION_REGEX);
    const target =
      (uiTriggerMatches?.length ?? 0) > 4 ? uiTriggerMatches?.[4] : undefined;

    return (
      <Fragment>
        <MainButton
          actionCost={data.actionCost}
          disabled={disabled}
          isWorking={isWorking}
          go={go}
          onClick={this.handleClick}
          classNames={data.buttonClassNames}
          target={target}
        >
          <ButtonLabel actions={actions} data={data} isWorking={isWorking}>
            {children}
          </ButtonLabel>
        </MainButton>
        {this.isActionLocked() && !isWorking && !suppressUnlockButton && (
          <ActionRefreshContext.Consumer>
            {({
              onOpenActionRefreshModal,
              onOpenPurchaseFateModal,
              onOpenEnhancedRefreshModal,
            }: IActionRefreshContextValues) => (
              <FateRefreshButton
                hasEnoughFate={hasEnoughFate}
                hasActionRefreshes={hasActionRefreshes}
                onOpenActionRefreshModal={onOpenActionRefreshModal}
                onOpenPurchaseFateModal={onOpenPurchaseFateModal}
                onOpenEnhancedRefreshModal={onOpenEnhancedRefreshModal}
                go={go}
              />
            )}
          </ActionRefreshContext.Consumer>
        )}
      </Fragment>
    );
  }
}

export type Props = ReturnType<typeof mapStateToProps> & {
  data: any;
  disabled?: boolean | undefined;
  dispatch: Function;
  go?: boolean | undefined;
  isWorking?: boolean | undefined;
  onClick: () => void;
  suppressUnlockButton?: boolean | undefined;
};

const mapStateToProps = (state: IAppState) => ({
  actions: state.actions.actions,
  currentFate: state.fate.data.currentFate,
  remainingActionRefreshes:
    state.settings.subscriptions.remainingActionRefreshes,
});

export default withRouter(connect(mapStateToProps)(ActionButton));

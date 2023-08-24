import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";

import MainButton from "./components/MainButton";

import ActionRefreshContext from "components/ActionRefreshContext";
import FateRefreshButton from "./components/FateRefreshButton";
import ButtonLabel from "./components/ButtonLabel";
import { IAppState } from "types/app";
import { IActionRefreshContextValues } from "components/ActionRefreshContext/ActionRefreshContext";

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
    } = this.props;

    const disabled = this.isDisabled();
    const hasEnoughFate = (currentFate || 0) >= 4;

    return (
      <Fragment>
        <MainButton
          actionCost={data.actionCost}
          disabled={disabled}
          isWorking={isWorking}
          go={go}
          onClick={this.handleClick}
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
            }: IActionRefreshContextValues) => (
              <FateRefreshButton
                hasEnoughFate={hasEnoughFate}
                onOpenActionRefreshModal={onOpenActionRefreshModal}
                onOpenPurchaseFateModal={onOpenPurchaseFateModal}
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
});

export default withRouter(connect(mapStateToProps)(ActionButton));

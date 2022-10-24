import React, { Component } from "react";

import { connect } from "react-redux";
import { withRouter, RouteComponentProps } from "react-router-dom";

import getQuantities from "selectors/exchange/getQuantities";

import Modal from "components/Modal";
import { IAppState } from "types/app";

import BazaarDialogComponent from "./BazaarDialogComponent";

type OwnProps = {
  activeItem: any | null;
  isOpen: boolean;
  onRequestClose: () => void;
};

type Props = RouteComponentProps &
  ReturnType<typeof mapStateToProps> &
  OwnProps;

class BazaarDialogContainer extends Component<Props, {}> {
  static displayName = "BazaarDialogContainer";

  mounted = false;

  componentDidMount = () => {
    // We've mounted.
    this.mounted = true;
  };

  componentDidUpdate = (prevProps: Props) => {
    const { activeItem } = this.props;
    // If by some chance we've changed active items without an unmount in between,
    // then ensure that we clobber the success message.
    if (prevProps.activeItem !== activeItem) {
      this.setState({ successMessage: null });
    }
  };

  componentWillUnmount = () => {
    // We're unmounted.
    this.mounted = false;
  };

  handleRequestClose = () => {
    const { onRequestClose } = this.props;
    onRequestClose();
    // Set a brief timeout so that we don't clear before the modal disappears
    // setTimeout(() => this.setState({ successMessage: null }), 200);
  };

  /**
   * Render
   * @return {Object}
   */
  render() {
    const { isFetchingSellItem, isOpen, quantities } = this.props;

    return (
      <Modal isOpen={isOpen} onRequestClose={this.handleRequestClose}>
        <BazaarDialogComponent
          isTransacting={isFetchingSellItem}
          quantities={quantities}
          onRequestClose={this.handleRequestClose}
        />
      </Modal>
    );
  }
}

const mapStateToProps = (state: IAppState) => {
  const {
    exchange: { isFetchingSellItem },
  } = state;
  const quantities = getQuantities(state);
  return {
    isFetchingSellItem,
    quantities,
  };
};

export default withRouter(connect(mapStateToProps)(BazaarDialogContainer));

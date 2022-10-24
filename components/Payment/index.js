import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { closeDialog } from "actions/payment";
import Dialog from "components/Dialog";

// import PurchaseSubscription from 'components/PurchaseSubscription';
// import PurchaseFate from './components/PurchaseFate';

class Payment extends Component {
  /**
   * Close Dialog
   * @return {undefined}
   */
  closeDialog = () => {
    const { dispatch } = this.props;
    dispatch(closeDialog());
  };

  /**
   * Render
   * @return {undefined}
   */
  render() {
    const { isDialogOpen, isSuccess, paymentType } = this.props;
    return (
      isDialogOpen && (
        <Dialog
          large={paymentType === "buy" && !isSuccess}
          isOpen={isDialogOpen}
          onRequestClose={this.closeDialog}
        >
          {/* paymentType === 'buy' ? <PurchaseFate /> : <PurchaseSubscription /> */}
        </Dialog>
      )
    );
  }
}

Payment.displayName = "Payment";

Payment.propTypes = {
  dispatch: PropTypes.func.isRequired,
  isDialogOpen: PropTypes.bool.isRequired,
  isSuccess: PropTypes.bool.isRequired,
  paymentType: PropTypes.string,
};

Payment.defaultProps = {
  paymentType: undefined,
};

const mapStateToProps = ({
  payment: { isDialogOpen, paymentType, isSuccess },
}) => ({
  isDialogOpen,
  isSuccess,
  paymentType,
});

export default connect(mapStateToProps)(Payment);

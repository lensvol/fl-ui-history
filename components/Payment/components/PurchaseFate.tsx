import React from "react";

import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { ThunkDispatch } from "redux-thunk";

import { IAppState } from "types/app";
import BraintreeView from "./BraintreeView";
import PurchaseFateSuccess from "./PurchaseFateSuccess";

function PurchaseFate(props: Props) {
  const { isSuccess, message } = props;

  if (isSuccess) {
    return <PurchaseFateSuccess message={message} />;
  }

  return (
    <div className="purchase-panel">
      <div className="payment-toggle">
        <div className="security-notice pull-right">
          <i className="icon icon-lock" /> Secure Payment
        </div>
      </div>
      <BraintreeView
        key="braintree"
        onCancel={() => {
          /* no-op */
        }}
      />
    </div>
  );
}

interface Props {
  dispatch: ThunkDispatch<any, any, any>;
  isSuccess: boolean;
  message?: string;
}

const mapStateToProps = ({ payment: { isSuccess, message } }: IAppState) => ({
  isSuccess,
  message,
});

export default withRouter(connect(mapStateToProps)(PurchaseFate));

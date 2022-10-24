import { nameChanged } from "actions/myself";
import React, { Component } from "react";
import { connect } from "react-redux";
import classnames from "classnames";

import { purchaseItem } from "actions/fate";

import Image from "components/Image";
import Loading from "components/Loading";
import { Success } from "services/BaseMonadicService";

import { IFateCard } from "types/fate";

import PurchaseResult from "./PurchaseResult";

type Props = {
  dispatch: Function; // eslint-disable-line
  data: IFateCard;
  onRequestClose: () => void;
};

type State = {
  isSubmitting: boolean;
  isSuccess?: boolean;
  message?: string;
  purchaseComplete: boolean;
  value: string;
};

export class PurchaseName extends Component<Props, State> {
  /*
  static propTypes = {
    data: types.fateData.isRequired,
    onRequestClose: PropTypes.func.isRequired,
  }

   */

  state: State = {
    isSubmitting: false,
    purchaseComplete: false,
    value: "",
  };

  handleChange = (e: { target: { value: string } }) => {
    this.setState({ value: e.target.value });
  };

  handleSubmit = async () => {
    const {
      dispatch,
      data: { id },
    } = this.props;
    const { isSubmitting, value } = this.state;
    if (isSubmitting || !value) {
      return;
    }

    const data = {
      storeItemId: id,
      newName: value,
    };

    this.setState({ isSubmitting: true });
    const result = await dispatch(purchaseItem(data));
    const isSuccess = result instanceof Success;
    const message = isSuccess ? result.data.message : result.message;
    if (isSuccess) {
      dispatch(nameChanged(value));
    }
    this.setState({
      isSuccess,
      message,
      isSubmitting: false,
      purchaseComplete: true,
    });
  };

  render = () => {
    const { onRequestClose, data: activePurchase } = this.props;

    const { image, name } = activePurchase;

    const { isSubmitting, isSuccess, message, purchaseComplete, value } =
      this.state;

    if (purchaseComplete) {
      return (
        <PurchaseResult
          image={image}
          name={name}
          isSuccess={isSuccess}
          message={message ?? ""}
          onClick={onRequestClose}
        />
      );
    }

    return (
      <div>
        <h3 className="heading heading--2" style={{ color: "#000" }}>
          Change your name
        </h3>
        <hr />
        <div className="media dialog__media">
          <div className="media__content dialog__content">
            <div className="media__left">
              <div>
                <Image
                  className="media__object"
                  icon={activePurchase.image}
                  alt={activePurchase.name}
                  width={78}
                  height={100}
                  type="icon"
                />
              </div>
            </div>
            <div className="media__body dialog__body">
              <p dangerouslySetInnerHTML={{ __html: message ?? "" }} />
              <p>You will now be known as:</p>
              <input
                type="text"
                className="form__control"
                onChange={this.handleChange}
                value={value}
              />
            </div>
            <hr />
          </div>
          <div className="dialog__actions">
            <button
              className={classnames(
                "button button--primary",
                isSubmitting && "button--disabled"
              )}
              onClick={this.handleSubmit}
              disabled={isSubmitting}
              type="button"
            >
              {isSubmitting ? <Loading spinner small /> : "Change"}
            </button>
          </div>
        </div>
      </div>
    );
  };
}

export default connect()(PurchaseName);

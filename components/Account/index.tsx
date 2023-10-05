import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { withRouter, RouteComponentProps } from "react-router-dom";

import { IAppState } from "types/app";

import RequestPasswordResetModal from "components/RequestPasswordResetModal";
import AccountComponent from "./AccountComponent";
import ForgottenPasswordResetModal from "./ForgottenPasswordResetModal";
import PasswordResetModal from "./PasswordResetModal";

type State = {
  hash: any | undefined;
  token: string | undefined;
  isForgottenPasswordResetModalOpen: boolean;
  isPasswordResetModalOpen: boolean;
  isPasswordResetRequestModalOpen: boolean;
};

class AccountContainer extends Component<Props, State> {
  static displayName = "AccountContainer";

  state = {
    hash: undefined,
    token: undefined,
    isForgottenPasswordResetModalOpen: false,
    isPasswordResetModalOpen: false,
    isPasswordResetRequestModalOpen: false,
  };

  /**
   * Component Did Mount
   * @return {undefined}
   */
  componentDidMount = () => {
    const {
      history,
      location: { hash },
      user: { loggedIn },
    } = this.props;

    const token = this.getQueryVariable("token");

    this.setState({ hash });

    if (token) {
      this.setState({
        token,
        isForgottenPasswordResetModalOpen: true,
      });
    } else if (!loggedIn) {
      history.push("/login");
    }
  };

  getQueryVariable = (variable: string) => {
    const query = window.location.search.substring(1);
    const vars = query.split("&");

    for (let i = 0; i < vars.length; i += 1) {
      const pair = vars[i].split("=");
      if (decodeURIComponent(pair[0]) === variable) {
        return decodeURIComponent(pair[1]);
      }
    }
    return undefined;
  };

  handleDismissForgottenPasswordResetModal = () => {
    this.setState({ isForgottenPasswordResetModalOpen: false });
  };

  handleDismissPasswordResetModal = () => {
    this.setState({ isPasswordResetModalOpen: false });
  };

  handleDismissPasswordResetRequestModal = () => {
    this.setState({ isPasswordResetRequestModalOpen: false });
  };

  handleSummonPasswordResetModal = () => {
    this.setState({ isPasswordResetModalOpen: true });
  };

  handleSummonPasswordResetRequestModal = () => {
    this.setState({ isPasswordResetRequestModalOpen: true });
  };

  /**
   * Render
   * @return {JSX}
   */
  render() {
    const {
      user: { loggedIn },
    } = this.props;

    const {
      hash,
      isForgottenPasswordResetModalOpen,
      isPasswordResetModalOpen,
      isPasswordResetRequestModalOpen,
      token,
    } = this.state;

    return (
      <Fragment>
        {loggedIn && <AccountComponent hash={hash} />}

        {/* Don't mount the forgotten password modal if we don't have a token */}
        {token && (
          <ForgottenPasswordResetModal
            isOpen={isForgottenPasswordResetModalOpen}
            onRequestClose={this.handleDismissForgottenPasswordResetModal}
            token={token as unknown as string} // TODO: why does this need double casting?
          />
        )}

        <PasswordResetModal
          isOpen={isPasswordResetModalOpen}
          onRequestClose={this.handleDismissPasswordResetModal}
          token={token}
        />

        <RequestPasswordResetModal
          isOpen={isPasswordResetRequestModalOpen}
          onRequestClose={this.handleDismissPasswordResetRequestModal}
        />
      </Fragment>
    );
  }
}

const mapStateToProps = ({ user }: IAppState) => ({
  user,
});

type Props = RouteComponentProps &
  ReturnType<typeof mapStateToProps> & {
    dispatch: ThunkDispatch<any, any, any>;
  };

export default withRouter(connect(mapStateToProps)(AccountContainer));

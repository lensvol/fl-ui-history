import React, { Component } from "react";
import classnames from "classnames";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { fetchInteractions } from "actions/messages";
import wait from "utils/wait";

type Props = {
  dispatch: Function;
};

type State = {
  isWorking: boolean;
};

export class FeedMessageControls extends Component<Props, State> {
  mounted = false;

  state = {
    isWorking: false,
  };

  componentDidMount = () => {
    this.mounted = true;
  };

  componentWillUnmount = () => {
    this.mounted = false;
  };

  handleRefresh = async () => {
    const { dispatch } = this.props;
    const { isWorking } = this.state;
    if (isWorking) {
      return;
    }
    this.setState({ isWorking: true });
    await dispatch(fetchInteractions());
    await wait(1500);
    if (this.mounted) {
      this.setState({ isWorking: false });
    }
  };

  render = () => (
    <div>
      <button
        className="button--link button--link-inverse"
        onClick={this.handleRefresh}
        type="button"
        style={{
          cursor: this.state.isWorking ? "not-allowed" : "pointer",
          marginRight: "2rem",
        }}
        disabled={this.state.isWorking}
      >
        <i
          className={classnames(
            "fa fa-refresh",
            this.state.isWorking && "fa-spin"
          )}
        />
      </button>
      <Link className="link--inverse" to="/account">
        <i className="fa fa-cog" />
        <span className="u-visually-hidden">Settings</span>
      </Link>
    </div>
  );
}

export default connect()(FeedMessageControls);

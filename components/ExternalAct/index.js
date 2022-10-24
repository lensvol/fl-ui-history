import React from "react";
import classnames from "classnames";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import {
  goBackFromSocialAct,
  sendExternalSocialInvite,
} from "actions/storylet";
import StoryletRoot from "components/StoryletRoot";

class ExternalAct extends React.Component {
  state = {
    targetEmailAddress: "",
    userEmailAddress: "",
    branchId: null,
  };

  componentDidMount = () => {
    const branchId = this.props.externalSocialAct.branch.id;

    this.setState({
      branchId,
      userEmailAddress: this.props.userEmailAddress,
    });
  };

  handleTargetChange = (e) => {
    this.setState({
      targetEmailAddress: e.target.value,
    });
  };

  handleUserChange = (e) => {
    this.setState({
      userEmailAddress: e.target.value,
    });
  };

  /**
   * Go Back
   * @return {undefined}
   */
  goBack = () => {
    this.props.dispatch(goBackFromSocialAct());
  };

  /**
   * Submit form
   * @return {undefined}
   */
  sendInvitation = (event) => {
    event.preventDefault();
    const data = {
      branchId: this.state.branchId,
      targetEmailAddress: this.state.targetEmailAddress,
      userEmailAddress: this.state.userEmailAddress,
    };

    this.props.dispatch(sendExternalSocialInvite(data));
  };

  /**
   * Render
   * @return {Object}
   */
  render() {
    const { externalSocialAct, userEmailAddress } = this.props;

    const buttonClass = classnames({
      button: true,
      "button--primary": true,
      // 'button--disabled' : !(this.state.userInput.targetCharacterId)
    });

    const errorMessage = externalSocialAct.message ? (
      <p style={{ color: "red" }}>{externalSocialAct.message}</p>
    ) : null;

    return (
      <div>
        <StoryletRoot data={externalSocialAct.branch} />
        <div className="branch">
          <div className="media__left" />
          <div className="media__body">
            <h2 className="media__heading heading heading--3">
              Invite a friend to join you
            </h2>
            <p>
              Send an email inviting your friend to join you in Fallen London.
            </p>
            {errorMessage}
            <form onSubmit={this.sendInvitation}>
              <div className="externalInviteEmail">
                <label htmlFor="user-email">From: </label>
                <input
                  id="user-email"
                  type="text"
                  placeholder="Your email"
                  name="userEmail"
                  defaultValue={userEmailAddress}
                  onChange={this.handleUserChange}
                />
              </div>
              <div>
                <label>To: </label>
                <input
                  type="text"
                  placeholder="Your friend's email"
                  name="inviteeEmail"
                  onChange={this.handleTargetChange}
                />
              </div>
              <div className="buttons">
                <button
                  id="ChooseActButton"
                  type="submit"
                  className={buttonClass}
                  disabled={false}
                >
                  Send invitation!
                </button>
              </div>
            </form>
          </div>
        </div>
        <p className="buttons buttons--left">
          <button
            type="button"
            className="button button--primary"
            onClick={this.goBack}
          >
            <i className="fa fa-arrow-left" /> Back
          </button>
        </p>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  // isSaving: state.storylet.isSaving,
  externalSocialAct: state.storylet.externalSocialAct,
  userEmailAddress: state.user.user.emailAddress,
  // message: state.storylet.message,
});

export default withRouter(connect(mapStateToProps)(ExternalAct));

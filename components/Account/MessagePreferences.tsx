import React, { ChangeEvent, Component } from "react";

import { connect } from "react-redux";
import { withRouter, RouteComponentProps } from "react-router-dom";

import * as SettingsActionCreators from "actions/settings";
import { ThunkDispatch } from "redux-thunk";
import { IAppState } from "types/app";

class MessagePreferences extends Component<Props> {
  updateMessagePreferences = () => {
    const { dispatch, messagePreferences } = this.props;
    dispatch(SettingsActionCreators.saveMessagePreferences(messagePreferences));
  };

  handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { dispatch, messagePreferences } = this.props;

    dispatch(
      SettingsActionCreators.updateMessagePreferences({
        ...messagePreferences,
        [e.target.name]: e.target.checked,
      })
    );
  };

  render() {
    const { messagePreferences, isSaving } = this.props;

    return (
      <div>
        <h2 className="heading heading--2">
          When should we message you directly?
        </h2>
        <form onSubmit={this.updateMessagePreferences}>
          <ul>
            <li className="checkbox">
              <label>
                <input
                  id="MessageAboutNiceness"
                  name="messageAboutNiceness"
                  checked={messagePreferences.messageAboutNiceness}
                  type="checkbox"
                  onChange={this.handleChange}
                />{" "}
                A player invites me to something
              </label>
            </li>
            <li className="checkbox">
              <label>
                <input
                  id="MessageAboutNastiness"
                  name="messageAboutNastiness"
                  type="checkbox"
                  checked={messagePreferences.messageAboutNastiness}
                  onChange={this.handleChange}
                />{" "}
                A player wants to engage me in combat
              </label>
            </li>
            <li className="checkbox">
              <label>
                <input
                  id="MessageAboutAnnouncements"
                  name="messageAboutAnnouncements"
                  type="checkbox"
                  checked={messagePreferences.messageAboutAnnouncements}
                  onChange={this.handleChange}
                />{" "}
                There is an announcement about the game
              </label>
            </li>
            <li className="checkbox">
              <label>
                <input
                  id="MessageAboutStorylets"
                  name="messageAboutStorylets"
                  type="checkbox"
                  checked={messagePreferences.messageAboutStorylets}
                  onChange={this.handleChange}
                />{" "}
                When a story develops
              </label>
            </li>
          </ul>
        </form>
        <p>
          <button
            className="button button--primary"
            onClick={this.updateMessagePreferences}
            type="button"
          >
            {isSaving ? "Saving..." : "Update"}
          </button>
        </p>
      </div>
    );
  }
}

const mapStateToProps = ({
  settings: { messagePreferences, isSaving },
}: IAppState) => ({
  isSaving,
  messagePreferences,
});

type Props = ReturnType<typeof mapStateToProps> &
  RouteComponentProps & {
    dispatch: ThunkDispatch<any, any, any>;
  };

export default withRouter(connect(mapStateToProps)(MessagePreferences));

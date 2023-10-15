import {
  deleteEntry,
  fetchSharedContent,
  toggleFavouriteJournalEntry,
} from "features/profile";
import classnames from "classnames";

import Buttonlet from "components/Buttonlet";
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import { ThunkDispatch } from "redux-thunk";
import { IAppState } from "types/app";

import DeleteDialog from "./DeleteDialog";

type State = {
  isStarring: boolean;
  modalIsOpen: boolean;
};

class JournalEntry extends Component<Props, State> {
  mounted = false;

  state = {
    isStarring: false,
    modalIsOpen: false,
  };

  static displayName = "JournalEntry";

  componentDidMount = () => {
    this.mounted = true;
  };

  componentWillUnmount = () => {
    this.mounted = false;
  };

  deleteAndClose = async () => {
    const { canEdit, data, dispatch } = this.props;
    // What are we doing here if we can't edit this profile? Never mind;
    // just return
    if (!canEdit) {
      return;
    }
    await dispatch(deleteEntry(data.id));
    if (this.mounted) {
      this.handleRequestClose();
    }
  };

  handleFetchFromId = () => {
    const {
      dispatch,
      profileCharacter,
      data: { id },
    } = this.props;
    const characterName = profileCharacter?.name;
    if (characterName) {
      dispatch(fetchSharedContent({ characterName, fromId: id }));
    }
  };

  handleRequestClose = () => {
    this.setState({ modalIsOpen: false });
  };

  showModal = () => {
    this.setState({ modalIsOpen: true });
  };

  handleToggleFavourite = async () => {
    this.setState({ isStarring: true });

    const {
      dispatch,
      data: { id },
      profileCharacter,
    } = this.props;

    await dispatch(
      toggleFavouriteJournalEntry({
        id: id,
      })
    );

    const characterName = profileCharacter?.name;

    if (characterName) {
      await dispatch(
        fetchSharedContent({
          characterName,
        })
      );
    }

    this.setState({ isStarring: false });
  };

  /**
   * Render
   * @return {Object}
   */
  render() {
    const { data, canEdit, isFetching, profileCharacter } = this.props;

    const { isStarring, modalIsOpen } = this.state;

    if (!profileCharacter) {
      return null;
    }

    const { name } = profileCharacter;
    const { areaName, fallenLondonDateTime, id, isFavourite } = data;

    return (
      <Fragment>
        <div
          className={classnames(
            "journal-entry",
            isFetching && "journal-entry--is-fetching"
          )}
          style={{ marginBottom: 16 }}
        >
          <div className="media__body">
            <div className="journal-entry__buttonlet">
              <Link
                className="link--inverse journal-entry__permalink"
                to={`/profile/${name}/${id}`}
                onClick={this.handleFetchFromId}
              >
                <i className="fa fa-link heading--1" />
              </Link>{" "}
              <Buttonlet
                type={isStarring ? "refresh" : isFavourite ? "star" : "star-o"}
                title={
                  canEdit
                    ? isFavourite
                      ? "Unmark as favourite"
                      : "Mark as favourite"
                    : undefined
                }
                onClick={canEdit ? this.handleToggleFavourite : () => {}}
                classNames={{
                  containerClassName: "journal-entry--star-button",
                  iconClassName: "journal-entry--star-icon",
                }}
                spin={canEdit && isStarring}
              />{" "}
              {canEdit && (
                <Buttonlet
                  type="delete"
                  title="Delete this plan"
                  onClick={this.showModal}
                />
              )}
            </div>
            <h4
              className="heading heading--2 heading--inverse journal-entry__title"
              dangerouslySetInnerHTML={{ __html: data.eventName }}
            />
            <h2 className="media__heading heading heading--3 journal-entry__date-and-location">
              <span className="journal-entry__date">
                {fallenLondonDateTime}{" "}
              </span>
              <span className="journal-entry__location">
                {areaName && `(${areaName})`}
              </span>
            </h2>
            <div
              className="journal-entry__body"
              dangerouslySetInnerHTML={{ __html: data.playerMessage }}
            />
          </div>
        </div>
        <DeleteDialog
          isOpen={modalIsOpen}
          isFetching={isFetching}
          onConfirm={this.deleteAndClose}
          onRequestClose={this.handleRequestClose}
        />
      </Fragment>
    );
  }
}

const mapStateToProps = ({ profile }: IAppState) => ({
  canEdit: profile.isLoggedInUsersProfile,
  profileCharacter: profile.profileCharacter,
});

type Props = ReturnType<typeof mapStateToProps> &
  RouteComponentProps & {
    data: any;
    dispatch: ThunkDispatch<any, any, any>;
    isFetching: boolean;
  };

export default withRouter(connect(mapStateToProps)(JournalEntry));

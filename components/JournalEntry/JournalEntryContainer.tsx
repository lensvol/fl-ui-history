import {
  deleteEntry,
  fetchSharedContent,
} from 'actions/profile';
import classnames from 'classnames';

import Buttonlet from 'components/Buttonlet';
import React, {
  Component,
  Fragment,
} from 'react';
import { connect } from 'react-redux';
import {
  Link,
  RouteComponentProps,
  withRouter,
} from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { IAppState } from 'types/app';

import DeleteDialog from './DeleteDialog';

type State = {
  modalIsOpen: boolean,
}

class JournalEntry extends Component<Props, State> {
  mounted = false;

  state = { modalIsOpen: false }

  static displayName = 'JournalEntry';

  componentDidMount = () => {
    this.mounted = true;
  }

  componentWillUnmount = () => {
    this.mounted = false;
  }

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
  }

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
  }

  handleRequestClose = () => {
    this.setState({ modalIsOpen: false });
  }

  showModal = () => {
    this.setState({ modalIsOpen: true });
  }

  /**
   * Render
   * @return {Object}
   */
  render() {
    const {
      data,
      canEdit,
      isFetching,
      profileCharacter,
    } = this.props;
    const { modalIsOpen } = this.state;

    if (!profileCharacter) {
      return null;
    }

    const { name } = profileCharacter;
    const {
      areaName,
      fallenLondonDateTime,
      id,
    } = data;

    return (
      <Fragment>
        <div
          className={classnames('journal-entry', isFetching && 'journal-entry--is-fetching')}
          style={{ marginBottom: 16 }}
        >
          <div className="media__body">
            <div className="journal-entry__buttonlet">
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
                {fallenLondonDateTime}
                {' '}
              </span>
              <span className="journal-entry__location">
                {areaName && `(${areaName})`}
                <Link
                  className="link--inverse journal-entry__permalink"
                  to={`/profile/${name}/${id}`}
                  onClick={this.handleFetchFromId}
                >
                  <i className="fa fa-link" />
                </Link>
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

/*
JournalEntry.displayName = 'JournalEntry';

JournalEntry.propTypes = {
  canEdit: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
  data: PropTypes.shape({}).isRequired,
  isFetching: PropTypes.bool.isRequired,
  profileCharacter: PropTypes.shape({}),
};

JournalEntry.defaultProps = {
  profileCharacter: undefined,
};
*/

const mapStateToProps = ({ profile }: IAppState) => ({
  canEdit: profile.isLoggedInUsersProfile,
  profileCharacter: profile.profileCharacter,
});

type Props = ReturnType<typeof mapStateToProps> & RouteComponentProps & {
  data: any,
  dispatch: ThunkDispatch<any, any, any>,
  isFetching: boolean,
};

export default withRouter(connect(mapStateToProps)(JournalEntry));
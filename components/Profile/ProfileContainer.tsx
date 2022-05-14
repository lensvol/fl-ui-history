import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import * as contactActions from 'actions/contacts';
import * as profileActions from 'actions/profile';

import Loading from 'components/Loading';
import Header from 'components/Header';
import JournalEntries from 'components/JournalEntries';
import MediaMdUp from 'components/Responsive/MediaMdUp';
import MediaSmDown from 'components/Responsive/MediaSmDown';
import MediaSmUp from 'components/Responsive/MediaSmUp';
import MediaXsDown from 'components/Responsive/MediaXsDown';
import TheySay from 'components/TheySay';
import { ThunkDispatch } from 'redux-thunk';
import { IAppState } from 'types/app';

import AddToContacts from './components/AddToContacts';
import Hero from './components/Hero';
import MantelAndScrap from './components/MantelAndScrap';
import ProfileCard from './components/ProfileCard';
import ProfileInventoryGroups from './components/ProfileInventoryGroups';

import ProfileContext from './ProfileContext';


class ProfileContainer extends Component<Props> {
  static displayName = 'ProfileContainer';

  componentDidMount = () => {
    const { dispatch, loggedIn } = this.props;
    this.fetchProfile();
    if (loggedIn) {
      dispatch(contactActions.fetchContacts());
    }
  };

  /**
   * Fetch this user's profile with permalink ID
   */
  fetchProfile = async () => {
    const { dispatch, match } = this.props;
    const { profileName } = match.params;
    await dispatch(profileActions.fetchProfile(profileName));
  };

  /**
   * Render
   * @return {Object}
   */
  render() {
    const {
      characterName,
      currentArea,
      profileCharacter,
      lookingAtOwnProfile,
    } = this.props;

    if (!profileCharacter) {
      return (
        <div>
          <Hero
            characterName={characterName}
            currentArea={currentArea}
          />
          <Loading spinner />
        </div>
      );
    }

    return (
      <ProfileContext.Provider
        value={{
          profileCharacter,
          editable: lookingAtOwnProfile,
        }}
      >
        <div>
          <Header />
          <Hero
            currentArea={currentArea}
            characterName={characterName}
          />

          <div className="profile">
            <div className="profile__left">
              <div className="profile__card-and-switcher">
                <div className="profile__card-and-header">
                  <h2 className="heading heading--2 profile__card-header">Cameo</h2>
                  <ProfileCard
                    profileUp
                  />
                </div>
                <div className="profile__card-and-header">
                  <h2 className="heading heading--2 profile__card-header">Lodgings</h2>
                  <ProfileCard />
                </div>
                <AddToContacts />
              </div>
              <div className="profile__inventory-groups">
                <ProfileInventoryGroups />
                <MediaSmUp>
                  <TheySay
                    profileCharacter={profileCharacter}
                    editable={lookingAtOwnProfile}
                  />
                </MediaSmUp>
                <MediaSmDown>
                  <MantelAndScrap />
                </MediaSmDown>
              </div>
              <MediaXsDown>
                <TheySay
                  profileCharacter={profileCharacter}
                  editable={lookingAtOwnProfile}
                />
              </MediaXsDown>
            </div>

            <div className="profile__body">
              <MediaMdUp>
                <MantelAndScrap />
              </MediaMdUp>
              <JournalEntries />
            </div>
          </div>
        </div>
      </ProfileContext.Provider>
    );
  }
}

const mapStateToProps = ({
  contacts: { contacts },
  profile: {
    characterName,
    currentArea,
    lookingAtOwnProfile,
    profileCharacter,
  },
  user: { loggedIn },
  myself: { qualities },
}: IAppState) => ({
  characterName,
  currentArea,
  lookingAtOwnProfile,
  profileCharacter,
  contacts,
  loggedIn,
  qualities,
  description: profileCharacter?.description,
});

type Props
  = RouteComponentProps<{ profileName: string }>
  & ReturnType<typeof mapStateToProps> & {
  dispatch: ThunkDispatch<any, any, any>,
};

export default withRouter(connect(mapStateToProps)(ProfileContainer));
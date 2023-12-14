import ProfileInventory from "components/Profile/ProfileInventory";
import { useAppDispatch, useAppSelector } from "features/app/store";
import { fetchProfile } from "features/profile";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

import { fetchContacts } from "features/contacts";

import Loading from "components/Loading";
import Header from "components/Header";
import JournalEntries from "components/JournalEntries";
// import MediaMdUp from 'components/Responsive/MediaMdUp';
// import MediaSmDown from 'components/Responsive/MediaSmDown';
// import MediaSmUp from 'components/Responsive/MediaSmUp';
// import MediaXsDown from 'components/Responsive/MediaXsDown';
import TheySay from "components/TheySay";

import Hero from "./Hero";
import MantelAndScrap from "./MantelAndScrap";
import ProfileDescription from "./ProfileDescription";
import ProfileName from "./ProfileName";
import ProfileCameo from "./ProfileCameo";
import ProfileLodgings from "./ProfileLodgings";

type Params = { profileName: string };

export default function ProfileContainer() {
  const dispatch = useAppDispatch();
  const params = useParams<Params>();
  const loggedIn = useAppSelector((s) => s.user.loggedIn);
  const profileCharacter = useAppSelector((s) => s.profile.profileCharacter);
  const profileBanner = useAppSelector((s) => s.profile.profileBanner);
  const outfitName = useAppSelector((s) => s.profile.outfitName);
  const hasFavouredOutfit = useAppSelector((s) => s.profile.hasFavouredOutfit);

  useEffect(() => {
    dispatch(fetchProfile({ characterName: params.profileName }));
    if (loggedIn) {
      dispatch(fetchContacts());
    }
  }, [dispatch, loggedIn, params.profileName]);

  if (!profileCharacter) {
    return (
      <div>
        <Hero image={profileBanner} />
        <Loading spinner />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <Hero image={profileBanner} />
      <div className="profile__container">
        <div className="profile__card-container">
          <div className="profile__card-and-header">
            <ProfileLodgings />
            <h2 className="heading heading--2 profile__card-header">
              Lodgings
            </h2>
          </div>
          <div className="profile__card-and-header">
            <ProfileCameo />
          </div>
        </div>
        <div className="profile__identity-container">
          <ProfileName />
          <ProfileDescription />
          <MantelAndScrap />
        </div>
        <div className="profile__inventory-theysay-container">
          <div />
          <div className="profile__inventory-header">
            <h3 className="heading heading--2">
              {hasFavouredOutfit ? "Favoured Outfit" : "Currently Wearing"}
            </h3>
            <h4 className="heading heading--4">{outfitName}</h4>
          </div>
          <ProfileInventory />
          <div />
          <div />
          <TheySay />
          <div />
        </div>
        <div className="profile__player-journal">
          <JournalEntries />
        </div>
      </div>
    </div>
  );
}

ProfileContainer.displayName = "ProfileContainer";

import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

import Header from "components/Header";
import JournalEntriesContainer from "components/JournalEntries";
import Loading from "components/Loading";
import Hero from "components/Profile/Hero";
import MantelAndScrap from "components/Profile/MantelAndScrap";
import ProfileCameo from "components/Profile/ProfileCameo";
import ProfileDescription from "components/Profile/ProfileDescription";
import ProfileInventory from "components/Profile/ProfileInventory";
import ProfileLodgings from "components/Profile/ProfileLodgings";
import ProfileName from "components/Profile/ProfileName";
import TheySay from "components/TheySay";
import TippyWrapper from "components/TippyWrapper";

import { useAppDispatch, useAppSelector } from "features/app/store";
import { fetchContacts } from "features/contacts";
import { fetchProfile } from "features/profile";

type Params = {
  profileName: string;
};

export default function ProfileContainer() {
  const dispatch = useAppDispatch();

  const params = useParams<Params>();

  const loggedIn = useAppSelector((s) => s.user.loggedIn);
  const profileCharacter = useAppSelector((s) => s.profile.profileCharacter);
  const profileBanner = useAppSelector((s) => s.profile.profileBanner);
  const outfitName = useAppSelector((s) => s.profile.outfitName);
  const hasFavouredOutfit = useAppSelector((s) => s.profile.hasFavouredOutfit);
  const isLoggedInUsersProfile = useAppSelector(
    (s) => s.profile.isLoggedInUsersProfile
  );

  const loggedInOutfitDescription =
    "Change this through the storylet &#8216;Attend to Matters of Identity&#8217;, in your Lodgings.";

  useEffect(() => {
    dispatch(
      fetchProfile({
        characterName: params.profileName,
      })
    );

    if (loggedIn) {
      dispatch(fetchContacts());
    }
  }, [dispatch, loggedIn, params]);

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
          <TippyWrapper
            tooltipData={
              isLoggedInUsersProfile
                ? {
                    description: loggedInOutfitDescription,
                  }
                : undefined
            }
          >
            <div className="profile__inventory-header">
              <h3 className="heading heading--2">
                {hasFavouredOutfit ? "Favoured Outfit" : "Currently Wearing"}
              </h3>
              <h4 className="heading heading--4">{outfitName}</h4>
            </div>
          </TippyWrapper>
          <ProfileInventory />
          <div />
          <div />
          <TheySay />
          <div />
        </div>
        <div className="profile__player-journal">
          <JournalEntriesContainer />
        </div>
      </div>
    </div>
  );
}

ProfileContainer.displayName = "ProfileContainer";

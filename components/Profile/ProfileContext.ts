import React from "react";

export type ProfileContextValue = {
  editable: boolean;
  profileCharacter: any;
};

const ProfileContext = React.createContext<ProfileContextValue>({
  editable: false,
  profileCharacter: {},
});
ProfileContext.displayName = "ProfileContext";

export default ProfileContext;

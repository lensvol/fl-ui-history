import React, { useEffect, useState } from "react";

import { useDispatch } from "react-redux";

import { fetch as fetchAvatars } from "actions/registration";

import Avatar from "components/CreateCharacter/components/AvatarSelection/Avatar";

import { useAppSelector } from "features/app/store";

type Props = {
  avatar?: string;
  onSelect: (avatar: string) => void;
};

export default function AvatarSelection({ avatar, onSelect }: Props) {
  const [didLoad, setDidLoad] = useState(false);

  const dispatch = useDispatch();
  const avatars = useAppSelector((state) => state.registration.avatars);

  useEffect(() => {
    if (didLoad) {
      return;
    }

    setDidLoad(true);

    if (!(avatars && avatars.length)) {
      dispatch(fetchAvatars());
    }
  }, [avatars, didLoad, dispatch]);

  return (
    <>
      <p className="lede">Choose the image that best represents you:</p>
      <ul className="signup-avatars">
        {avatars &&
          avatars.map((name) => (
            <Avatar
              key={name}
              name={name}
              active={name === avatar}
              onClick={() => onSelect(name)}
            />
          ))}
      </ul>
    </>
  );
}

AvatarSelection.displayName = "AvatarSelection";

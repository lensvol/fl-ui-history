import React from 'react';
import { connect } from 'react-redux';
import Image from 'components/Image';
import { IAppState } from 'types/app';

type OwnProps = {
  profileUp?: boolean,
};
type Props = OwnProps & ReturnType<typeof mapStateToProps>;

export function ProfileCard(props: Props) {
  const {
    profileCharacter,
    profileUp,
  } = props;

  if (profileCharacter == null) {
    return null;
  }

  const {
    avatarImage,
    currentDomicile,
  } = profileCharacter;

  if (!currentDomicile) {
    return null;
  }

  const icon = profileUp ? avatarImage : currentDomicile.image;
  const iconType = profileUp ? 'cameo' : 'lodgings';
  const tooltipData = profileUp ? undefined : { ...currentDomicile, image: undefined };

  return (
    <Image
      className="media__object profile__card"
      icon={icon}
      alt="You"
      type={iconType}
      border={false}
      tooltipData={tooltipData}
      tooltipPos="bottom"
      defaultCursor
    />
  );
}

ProfileCard.displayName = 'ProfileCard';

const mapStateToProps = ({ profile: { profileCharacter } }: IAppState) => ({ profileCharacter });

export default connect(mapStateToProps)(ProfileCard);

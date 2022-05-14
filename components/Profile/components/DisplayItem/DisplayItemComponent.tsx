import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';

import { buildTooltipData } from 'components/SidebarQualities/utils';
import Image from 'components/Image';
import { IAppState } from 'types/app';
import { IQuality } from 'types/qualities';

function DisplayItemComponent({
  data,
  editable,
  label,
  onClick,
}: Props) {
  const {
    effectiveLevel,
    image,
    nameAndLevel,
  } = data;

  const tooltipData = buildTooltipData(data);

  return (
    <div className="profile__display-item-container">
      <h3 className="heading heading--2">{label}</h3>
      <ul className="items items--list">
        <li className="js-item item item--no-padding">
          <div
            className={classnames(
              'icon icon--inventory profile__display-item',
              editable && 'profile__display-item--editable',
            )}
          >
            <Image
              defaultCursor={!editable}
              icon={image}
              alt={nameAndLevel}
              type="small-icon"
              tooltipData={tooltipData}
              onClick={onClick ?? undefined}
            />
            <span className="icon__value">{effectiveLevel}</span>
          </div>
          <div className="item__desc">
            <span className="js-item-name item__name">
              {nameAndLevel}
            </span>
          </div>
        </li>
      </ul>
    </div>
  );
}

interface OwnProps {
  data: IQuality,
  editable: boolean,
  label: string,
  onClick: (...args: any) => any | null,
}

const mapStateToProps = ({ profile: { lookingAtOwnProfile } }: IAppState) => ({ lookingAtOwnProfile });

type Props = OwnProps & ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(DisplayItemComponent);

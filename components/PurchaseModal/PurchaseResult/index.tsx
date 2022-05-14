import React from 'react';

import Image from 'components/Image';
import { ImageType } from 'utils/getImagePath';

import Title from './Title';
import Subtitle from './Subtitle';

type Props = {
  image: string,
  isFree?: boolean,
  isSuccess?: boolean,
  message: string,
  name: string,
  onClick: () => void,
  type?: ImageType,
};

export default function PurchaseResult(props: Props) {
  const {
    image,
    isFree,
    isSuccess,
    message,
    name,
    onClick,
    type,
  } = props;

  return (
    <div className="media dialog__media">
      <div className="media__content">
        <div className="media__left">
          <div>
            <Image
              className="media__object"
              icon={image}
              alt={name}
              width={78}
              height={100}
              type={type || 'icon'}
            />
          </div>
        </div>
        <div className="media__body">
          <Title isSuccess={isSuccess ?? false} />
          <hr />
          <Subtitle
            isFree={isFree ?? false}
            isSuccess={isSuccess ?? false}
          />
          <p dangerouslySetInnerHTML={{ __html: message }} />
        </div>
        <hr />
        <div className="dialog__actions">
          <button
            className="button button--primary"
            onClick={onClick}
            type="button"
          >
            Ok
          </button>
        </div>
      </div>
    </div>
  );
}

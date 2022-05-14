import React from 'react';

import Image from 'components/Image';
import ShareForm from './ShareForm';

export default function ShareFormContent({
  borderColour,
  data,
  onSubmit,
  title,
}: Props) {
  return (
    <div className="modal__content">
      <h1 className="heading heading--1">
        Record This Snippet In Your Journal
      </h1>
      <div className="media">

        <div className="media__left">
          <div className="card card--sm">
            <Image
              className="media__object"
              icon={data.image}
              alt={data.name}
              width={91}
              height={113}
              border={borderColour}
              type="icon"
            />
          </div>
        </div>

        <div className="media__body">
          <p>Use this header — or write your own:</p>
          <ShareForm data={data} title={title} onSubmit={onSubmit} />

        </div>
      </div>
    </div>
  );
}

interface Props {
  borderColour?: string,
  data: {
    description: string,
    image: string,
    name: string,
  },
  isSharing: boolean,
  onChange: (...args: any) => void,
  onSubmit: (...args: any) => void,
  title?: string,
}

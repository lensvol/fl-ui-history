import React from "react";
import { connect } from "react-redux";

import { stripHtml } from "utils/stringFunctions";
import Image from "components/Image";
import { IAppState } from "types/app";

interface Props {
  borderColour?: string;
  characterName: string;
  data: {
    image: string;
    name: string;
  };
  shareMessageResponse?: string;
}

export function ShareResponse({
  borderColour,
  characterName,
  data,
  shareMessageResponse,
}: Props) {
  return (
    <div>
      <h1 className="heading heading--1">Recorded for posterity!</h1>
      <div className="media" style={{ display: "flex" }}>
        <div className="media__left">
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

        <div className="media__body">
          <p className="descriptive">
            {shareMessageResponse
              ? `"${stripHtml(shareMessageResponse)}"`
              : null}
          </p>
          <p>View or delete it here</p>
          <a
            href={`/profile/${characterName}`}
            className="link link--inverse"
            target="_blank"
            rel="noopener noreferrer"
          >
            Your Journal
          </a>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = ({
  myself: {
    character: { name: characterName },
  },
}: IAppState) => ({ characterName });

export default connect(mapStateToProps)(ShareResponse);

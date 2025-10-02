import React, { useMemo } from "react";

import Image from "components/Image";

import { useAppSelector } from "features/app/store";

import { stripHtml } from "utils/stringFunctions";

interface Props {
  borderColour?: string;
  data: {
    image: string;
    name: string;
  };
  shareErrorResponse?: string;
  shareMessageResponse?: string;
}

export default function ShareResponse({
  borderColour,
  data,
  shareErrorResponse,
  shareMessageResponse,
}: Props) {
  const characterName = useAppSelector((state) => state.myself.character.name);

  const responseText = useMemo(() => {
    if (shareErrorResponse) {
      return shareErrorResponse;
    }

    if (shareMessageResponse) {
      return `"${stripHtml(shareMessageResponse)}"`;
    }

    return undefined;
  }, [shareErrorResponse, shareMessageResponse]);

  const isError = responseText === shareErrorResponse;

  const headerText = isError ? "Save Failed" : "Recorded for posterity!";

  return (
    <div>
      <h1 className="heading heading--1">{headerText}</h1>
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
          <p className="descriptive">{responseText}</p>
          {!isError && (
            <>
              <p>View or delete it here</p>
              <a
                href={`/profile/${encodeURIComponent(characterName)}`}
                className="link link--inverse"
                target="_blank"
                rel="noopener noreferrer"
              >
                Your Journal
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

ShareResponse.displayName = "ShareResponse";

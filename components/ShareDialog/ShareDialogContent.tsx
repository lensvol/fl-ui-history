import React from "react";

import Loading from "components/Loading";
import ShareFormContent from "components/ShareDialog/components/ShareFormContent";
import ShareResponse from "components/ShareDialog/components/ShareResponse";
import { LOADING, SHARE_COMPLETE } from "components/ShareDialog/constants";

interface Props {
  borderColour?: string;
  data: any;
  isSharing: boolean;
  onChange: (...args: any) => void;
  onSubmit: (...args: any) => void;
  shareErrorResponse?: string;
  shareMessageResponse?: string;
  step: string;
  title?: string;
}

export default function ShareDialogContent({
  borderColour,
  data,
  isSharing,
  onChange,
  onSubmit,
  shareErrorResponse,
  shareMessageResponse,
  step,
  title,
}: Props) {
  switch (step) {
    case LOADING:
      return <Loading spinner />;

    case SHARE_COMPLETE:
      return (
        <ShareResponse
          borderColour={borderColour}
          data={data}
          shareErrorResponse={shareErrorResponse}
          shareMessageResponse={shareMessageResponse}
        />
      );

    default:
      return (
        <ShareFormContent
          borderColour={borderColour}
          data={data}
          isSharing={isSharing}
          onChange={onChange}
          onSubmit={onSubmit}
          title={title}
        />
      );
  }
}

ShareDialogContent.displayName = "ShareDialogContent";

import React from "react";

import Loading from "components/Loading";

import ShareFormContent from "./components/ShareFormContent";
import ShareResponse from "./components/ShareResponse";

import { LOADING, SHARE_COMPLETE } from "./constants";

interface Props {
  borderColour?: string;
  data: any;
  isSharing: boolean;
  onChange: (...args: any) => void;
  onSubmit: (...args: any) => void;
  shareMessageResponse?: string;
  step: string;
  title?: string;
}

export default function ShareDialogContent(props: Props) {
  const {
    borderColour,
    data,
    isSharing,
    onChange,
    onSubmit,
    shareMessageResponse,
    step,
    title,
  } = props;
  switch (step) {
    case LOADING:
      return <Loading spinner />;
    case SHARE_COMPLETE:
      return (
        <ShareResponse
          borderColour={borderColour}
          data={data}
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

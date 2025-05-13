import React from "react";

import Loading from "components/Loading";

type Props = {
  actions: number;
  children?: React.ReactNode;
  data: any;
  isWorking?: boolean;
};

export default function ButtonLabel({
  actions,
  children,
  data,
  isWorking,
}: Props) {
  if (isWorking) {
    return <Loading spinner small />;
  }

  if (children) {
    return <>{children}</>;
  }

  if (!data.isPlotReport && actions < data.actionCost) {
    return <span>Not enough actions</span>;
  }

  if (data.currencyLocked) {
    return <span>Locked</span>;
  }

  if (data.requirementLocked) {
    return <span>Locked</span>;
  }

  if (data.buttonText) {
    return <span dangerouslySetInnerHTML={{ __html: data.buttonText }} />;
  }

  return <span>Go</span>;
}

ButtonLabel.displayName = "ButtonLabel";

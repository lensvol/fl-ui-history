import React from "react";

import QualityUpdate from "components/QualityUpdates/QualityUpdate";

import { ApiResultMessageQualityEffect } from "types/app/messages";

type Props = {
  updates: ApiResultMessageQualityEffect[];
};

export default function QualityUpdatesList({ updates }: Props) {
  return (
    <>
      {updates.map((update) => (
        <QualityUpdate key={`${update.type}$${update.message}`} data={update} />
      ))}
    </>
  );
}

QualityUpdatesList.displayName = "QualityUpdatesList";

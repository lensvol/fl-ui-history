import React from "react";
import QualityUpdate from "components/QualityUpdates/QualityUpdate";
import { ApiResultMessageQualityEffect } from "types/app/messages";

export default function QualityUpdatesList({
  updates,
}: {
  updates: ApiResultMessageQualityEffect[];
}) {
  return (
    <>
      {updates.map((update) => (
        <QualityUpdate key={`${update.type}$${update.message}`} data={update} />
      ))}
    </>
  );
}

import React from "react";
import { ApiQualityRequirement } from "types/storylet";
import Form from "./Form";
import PlanStateContext from "./PlanStateContext";

export default function FormOrNotes({
  data,
  editing,
  onSubmit,
  onToggleEditMode,
  qualityRequirements,
}: Props) {
  if (editing) {
    return (
      <PlanStateContext.Consumer>
        {({ isSaving }) => (
          <Form
            data={data}
            isSaving={isSaving}
            onSubmit={onSubmit}
            qualityRequirements={qualityRequirements}
          />
        )}
      </PlanStateContext.Consumer>
    );
  }
  return (
    <button
      className="button--link button--link-inverse"
      onClick={onToggleEditMode}
      type="button"
    >
      {data.notes}
    </button>
  );
}

type Props = {
  data: any;
  editing: boolean;
  onSubmit: (_?: unknown) => unknown;
  onToggleEditMode: () => void;
  qualityRequirements: ApiQualityRequirement[];
};

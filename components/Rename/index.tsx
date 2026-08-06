import React, { useCallback } from "react";

import { useDispatch } from "react-redux";

import { goBackFromSocialAct } from "actions/storylet";

import RenameQualityForm from "components/Rename/RenameQualityForm";
import StoryletRoot from "components/StoryletRoot";

import { useAppSelector } from "features/app/store";

import { IQuality } from "types/qualities";

export default function RenameContainer() {
  const dispatch = useDispatch();

  const branch = useAppSelector((state) => state.storylet.rename.branch);
  const qualities = useAppSelector(
    (state) => state.storylet.rename.namableQualitiesPossessed
  );

  const handleGoBack = useCallback(() => {
    dispatch(goBackFromSocialAct());
  }, [dispatch]);

  return (
    <div>
      <StoryletRoot data={branch} />

      {qualities.map((q: IQuality) => (
        <RenameQualityForm
          branchId={branch.id}
          key={q.qualityPossessedId}
          qualityName={q.name}
          qualityPossessedId={q.qualityPossessedId}
        />
      ))}

      <p className="buttons buttons--left">
        <button
          className="button button--primary"
          onClick={handleGoBack}
          type="button"
        >
          <i className="fa fa-arrow-left" /> Back
        </button>
      </p>
    </div>
  );
}

RenameContainer.displayName = "RenameContainer";

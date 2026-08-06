import React, { useEffect } from "react";

import { useDispatch } from "react-redux";

import { fetch as fetchSettings } from "actions/settings";

import MetaQuality from "components/Account/MetaQuality";
import Loading from "components/Loading";

import { useAppSelector } from "features/app/store";

export default function MetaQualities() {
  const data = useAppSelector((state) => state.settings.data);
  const isFetching = useAppSelector((state) => state.settings.isFetching);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!data) {
      dispatch(fetchSettings());
    }
  }, [data, dispatch]);

  if (isFetching) {
    return (
      <div
        style={{
          padding: 24,
        }}
      >
        <Loading spinner />
      </div>
    );
  }

  // Hide the whole section if we have no metaqualities to show
  if (!data.qualitiesPossessedList?.length) {
    return null;
  }

  return (
    <div>
      <h2 className="heading heading--2">Metaqualities</h2>
      <ul className="metaqualities__list">
        {data.qualitiesPossessedList.map((quality) => (
          <MetaQuality key={quality.id} data={quality} />
        ))}
      </ul>
    </div>
  );
}

MetaQualities.displayName = "MetaQualities";

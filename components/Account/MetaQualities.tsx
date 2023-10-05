import React, { useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import { IAppState } from "types/app";
import MetaQuality from "components/Account/MetaQuality";

import { fetch as fetchSettings } from "actions/settings";

import Loading from "components/Loading";

export const MetaQualities = ({ data, isFetching }: Props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!data) {
      dispatch(fetchSettings());
    }
  }, [data, dispatch]);

  if (isFetching) {
    return (
      <div style={{ padding: 24 }}>
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
};

const mapStateToProps = ({ settings: { data, isFetching } }: IAppState) => ({
  data,
  isFetching,
});

type Props = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(MetaQualities);

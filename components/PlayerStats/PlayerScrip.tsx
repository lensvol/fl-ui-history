import Loading from "components/Loading";
import React from "react";
import { connect } from "react-redux";
import { IAppState } from "types/app";
import getScripQuality from "selectors/sidebar/getScripQuality";
import Image from "components/Image";

export function PlayerScrip({ isFetching, scripQuality }: Props) {
  if (!scripQuality) {
    return null;
  }

  if (scripQuality.effectiveLevel <= 0) {
    return null;
  }

  return (
    <li className="item">
      <div className="icon icon--circular" style={{ width: "45px" }}>
        <Image type="small-icon" icon="currency3_copper" />
      </div>
      <div className="item__desc">
        <span className="item__name">{scripQuality.name}</span>
        <Value isFetching={isFetching} value={scripQuality.effectiveLevel} />
      </div>
    </li>
  );
}

function Value({
  isFetching,
  value,
}: Pick<Props, "isFetching"> & { value: number }) {
  if (isFetching) {
    return (
      <div>
        {" "}
        <Loading spinner small />
      </div>
    );
  }
  return <div className="item__value">{value}</div>;
}

const mapStateToProps = (state: IAppState) => ({
  isFetching: state.myself.isFetching,
  scripQuality: getScripQuality(state),
});

type Props = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(PlayerScrip);

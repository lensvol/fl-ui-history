import { IAppState } from "types/app";
import FateHeader from "components/Fate/Header";
import React from "react";
import { connect } from "react-redux";

interface Props {
  data: any;
  onNext: (_?: any) => void;
}

export function Blurb(props: Props) {
  const { data, onNext } = props;
  return (
    <FateHeader
      data={data}
      onClick={onNext}
      concealStoryTrailerOnSmallDevices
    />
  );
}

Blurb.displayName = "Blurb";

const mapStateToProps = ({ fate }: IAppState) => ({ data: fate.data });

export default connect(mapStateToProps)(Blurb);

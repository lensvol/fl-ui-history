import { IAppState } from "types/app";
import FateHeader from "components/Fate/Header";
import React from "react";
import { connect } from "react-redux";
import { PremiumSubscriptionType } from "types/subscription";

interface Props {
  data: any;
  hasSubscription: boolean;
  onNext: (_?: any) => void;
  renewDate?: string;
  subscriptionType?: PremiumSubscriptionType;
}

export function Blurb({
  data,
  hasSubscription,
  onNext,
  renewDate,
  subscriptionType,
}: Props) {
  return (
    <FateHeader
      concealStoryTrailerOnSmallDevices
      data={data}
      hasSubscription={hasSubscription}
      onClick={onNext}
      renewDate={renewDate}
      subscriptionType={subscriptionType}
    />
  );
}

Blurb.displayName = "Blurb";

const mapStateToProps = ({ fate }: IAppState) => ({ data: fate.data });

export default connect(mapStateToProps)(Blurb);

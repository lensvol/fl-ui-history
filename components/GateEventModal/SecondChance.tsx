import React, { Fragment } from "react";
import { connect } from "react-redux";
import { StoryletRoot } from "components/StoryletRoot";

import SecondChanceComponent from "components/SecondChance/SecondChanceComponent";
import { ThunkDispatch } from "redux-thunk";
import { IChooseBranchRequestData } from "services/StoryletService";
import { IAppState } from "types/app";
import { IBranch } from "types/storylet";

export function SecondChance(props: Props) {
  const {
    dispatch,
    messages,
    onChooseBranch,
    onGoBack,
    privilegeLevel,
    secondChance,
    storylet,
  } = props;
  return (
    <Fragment>
      <StoryletRoot
        data={storylet}
        dispatch={dispatch}
        isChoosing={false}
        isGoingBack={false}
        privilegeLevel={privilegeLevel}
        shareData={storylet}
      />
      <SecondChanceComponent
        messages={messages}
        onChooseBranch={onChooseBranch}
        onGoBack={onGoBack}
        secondChance={secondChance}
        storylet={storylet}
      />
    </Fragment>
  );
}

const mapStateToProps = (state: IAppState) => ({
  privilegeLevel: state.user.privilegeLevel,
});

type Props = ReturnType<typeof mapStateToProps> & {
  dispatch: ThunkDispatch<any, any, any>;
  messages: any;
  onChooseBranch: (data: IBranch & IChooseBranchRequestData) => Promise<void>;
  onGoBack: () => Promise<void>;
  secondChance: any;
  storylet: any;
};

export default connect(mapStateToProps)(SecondChance);

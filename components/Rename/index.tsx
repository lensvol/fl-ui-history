import RenameQualityForm from "components/Rename/RenameQualityForm";
import StoryletRoot from "components/StoryletRoot";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, RouteComponentProps } from "react-router-dom";

import { goBackFromSocialAct } from "actions/storylet";

import { IAppState } from "types/app";
import { IQuality } from "types/qualities";

class RenameContainer extends Component<Props> {
  static displayName = "RenameContainer";

  handleGoBack = () => {
    const { dispatch } = this.props;
    dispatch(goBackFromSocialAct());
  };

  render() {
    const { branch, qualities } = this.props;
    const onGoBack = this.handleGoBack;

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
            onClick={onGoBack}
            type="button"
          >
            <i className="fa fa-arrow-left" /> Back
          </button>
        </p>
      </div>
    );
  }
}

const mapStateToProps = ({
  storylet: {
    rename: { branch, namableQualitiesPossessed: qualities },
  },
}: IAppState) => ({
  branch,
  qualities,
});

interface Props
  extends ReturnType<typeof mapStateToProps>,
    RouteComponentProps {
  dispatch: Function; // eslint-disable-line
}

export default withRouter(connect(mapStateToProps)(RenameContainer));

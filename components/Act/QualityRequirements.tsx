import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { IAppState } from "types/app";

class QualityRequirementsContainer extends PureComponent<Props> {
  render = () => {
    const { inviteeQreqText, inviterQreqText } = this.props;

    return (
      <div className="media--root act__quality-requirements">
        {inviterQreqText && (
          <div className="act__quality-requirement">
            You must have{" "}
            <div
              className="act__quality-requirement-list-container"
              dangerouslySetInnerHTML={{ __html: inviterQreqText }}
            />
          </div>
        )}
        {inviteeQreqText && (
          <div className="act__quality-requirement">
            They must have{" "}
            <div
              className="act__quality-requirement-list-container"
              dangerouslySetInnerHTML={{ __html: inviteeQreqText }}
            />
          </div>
        )}
      </div>
    );
  };
}

const mapStateToProps = ({ socialAct: { inviteeData } }: IAppState) => ({
  inviteeQreqText: inviteeData?.actQReqText,
  inviterQreqText: inviteeData?.actInviterQReqText,
});

type Props = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(QualityRequirementsContainer);

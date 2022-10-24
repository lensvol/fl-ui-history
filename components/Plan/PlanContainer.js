import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import * as PlansActionCreators from "actions/plans";

import QualityRequirement from "components/QualityRequirement";
import PlanComponent from "./PlanComponent";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import ConfirmRefreshModal from "./ConfirmRefreshModal";
import PlanStateContext from "./PlanStateContext";

const MAX_ACTIVE_PLANS = 20;

export class PlanContainer extends Component {
  state = {
    isConfirmDeleteModalOpen: false,
    isConfirmRefreshModalOpen: false,
    isSaving: false,
    editing: false,
  };

  componentDidMount = () => {
    const { data } = this.props;
    this.setState({ editing: !data.notes });
  };

  toggleEditMode = () => {
    const { editing } = this.state;
    this.setState({ editing: !editing });
  };

  handleCloseConfirmDeleteModal = () => {
    this.setState({ isConfirmDeleteModalOpen: false });
  };

  handleCloseConfirmRefreshModal = () => {
    this.setState({ isConfirmRefreshModalOpen: false });
  };

  handleConfirmDelete = () => {
    const {
      dispatch,
      data: {
        branch: { id },
      },
    } = this.props;
    dispatch(PlansActionCreators.deletePlan(id));
  };

  handleConfirmRefresh = () => {
    const { data, dispatch } = this.props;
    const formData = { ...data, refresh: true };
    dispatch(PlansActionCreators.saveEditPlan(formData));
  };

  handleDelete = () => {
    this.setState({ isConfirmDeleteModalOpen: true });
  };

  handleSubmit = async (data) => {
    const { dispatch } = this.props;
    const formData = { ...data, refresh: false };
    this.setState({ isSaving: true });
    await dispatch(PlansActionCreators.saveEditPlan(formData));
    this.setState({
      editing: false,
      isSaving: false,
    });
  };

  handleRefresh = () => {
    this.setState({ isConfirmRefreshModalOpen: true });
  };

  /**
   * Render
   * @return {Object}
   */
  render = () => {
    const { activePlans, data, canRefresh } = this.props;
    const {
      editing,
      isConfirmDeleteModalOpen,
      isConfirmRefreshModalOpen,
      isSaving,
    } = this.state;

    const { branch } = data;

    const playerHasMaximumActivePlans = activePlans.length >= MAX_ACTIVE_PLANS;
    const qualityRequirements = branch.qualityRequirements.map((q) => (
      <QualityRequirement key={q.qualityId} data={q} />
    ));

    return (
      <Fragment>
        <PlanStateContext.Provider
          value={{
            isSaving,
          }}
        >
          <PlanComponent
            canRefresh={canRefresh}
            data={data}
            editing={editing}
            isSaving={isSaving}
            qualityRequirements={qualityRequirements}
            onDelete={this.handleDelete}
            onRefresh={this.handleRefresh}
            onSubmit={this.handleSubmit}
            onToggleEditMode={this.toggleEditMode}
          />
        </PlanStateContext.Provider>
        <ConfirmDeleteModal
          isOpen={isConfirmDeleteModalOpen}
          onConfirm={this.handleConfirmDelete}
          onRequestClose={this.handleCloseConfirmDeleteModal}
        />
        <ConfirmRefreshModal
          playerHasMaximumActivePlans={playerHasMaximumActivePlans}
          isOpen={isConfirmRefreshModalOpen}
          onConfirm={this.handleConfirmRefresh}
          onRequestClose={this.handleCloseConfirmRefreshModal}
        />
      </Fragment>
    );
  };
}

PlanContainer.displayName = "PlanContainer";

PlanContainer.propTypes = {
  activePlans: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  canRefresh: PropTypes.bool.isRequired,
  data: PropTypes.shape({}).isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = ({ plans: { activePlans } }) => ({ activePlans });

export default connect(mapStateToProps)(PlanContainer);

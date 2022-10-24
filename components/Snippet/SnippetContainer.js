import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Success } from "services/BaseMonadicService";

import { stripHtml } from "utils/stringFunctions";

import { shareContent } from "actions/profile";
import { fetchSnippets } from "actions/infoBar";
import ShareDialog from "components/ShareDialog";
import SnippetComponent from "./SnippetComponent";

class SnippetContainer extends Component {
  /**
   * componentWillMount
   * @return {undefined}
   */

  state = {
    isFetching: false,
    isSharing: false,
    shareDialogIsOpen: false,
    index: 0,
  };

  handleSubmit = async (title) => {
    const { dispatch, snippets } = this.props;
    const { index } = this.state;
    const snippet = snippets[index];
    const contentClass = "Sidebar";
    const contentKey = snippet.id;
    const image = snippet.image || null;
    const message = stripHtml(title);

    this.setState({ isSharing: true });

    const result = await dispatch(
      shareContent({
        contentClass,
        contentKey,
        image,
        message,
      })
    );

    this.setState({ isSharing: false });

    if (result instanceof Success) {
      const { data } = result;
      this.setState({ shareMessageResponse: data.message });
    }
    return result;
  };

  handleCloseShareDialog = () => {
    this.setState({
      shareDialogIsOpen: false,
      shareMessageResponse: undefined,
    });
  };

  handleOpenShareDialog = () => {
    this.setState({ shareDialogIsOpen: true });
  };

  handleShowNextSnippet = async () => {
    const { snippets } = this.props;
    const { index } = this.state;
    const newIndex = index + 1;

    if (!snippets[newIndex]) {
      await this.getMoreSnippets();
    }

    this.setState({
      index: newIndex,
      shareMessageResponse: undefined,
    });
  };

  getMoreSnippets = async () => {
    const { dispatch } = this.props;
    this.setState({ isFetching: true });
    await dispatch(fetchSnippets());
    this.setState({ isFetching: false });
  };

  render() {
    const { snippets } = this.props;
    const {
      index,
      isFetching,
      isSharing,
      shareDialogIsOpen,
      shareMessageResponse,
    } = this.state;

    const snippet = snippets[index];

    // If we don't have any snippets, then return null
    if (!snippet) {
      return null;
    }

    const { description, title } = snippet;

    return (
      <Fragment>
        <SnippetComponent
          description={description}
          isFetching={isFetching}
          onShare={this.handleOpenShareDialog}
          onShowNextSnippet={this.handleShowNextSnippet}
          title={title}
        />
        {shareDialogIsOpen && (
          <ShareDialog
            onSubmit={this.handleSubmit}
            isOpen={shareDialogIsOpen}
            isSharing={isSharing}
            onRequestClose={this.handleCloseShareDialog}
            shareMessageResponse={shareMessageResponse}
            data={{
              description: snippet.description,
              id: snippet.id,
              image: snippet.image,
              name: snippet.title,
            }}
          />
        )}
      </Fragment>
    );
  }
}

SnippetContainer.displayName = "SnippetContainer";

SnippetContainer.propTypes = {
  snippets: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

const mapStateToProps = ({ infoBar: { snippets } }) => ({ snippets });

export default withRouter(connect(mapStateToProps)(SnippetContainer));

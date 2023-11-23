import { useAppDispatch, useAppSelector } from "features/app/store";
import React, { Fragment, useState, useCallback } from "react";

import { stripHtml } from "utils/stringFunctions";

import { shareContent } from "features/profile";
import { fetchSnippets } from "actions/infoBar";
import ShareDialog from "components/ShareDialog";
import SnippetComponent from "./SnippetComponent";

export default function SnippetContainer() {
  const dispatch = useAppDispatch();

  const snippets = useAppSelector((s) => s.infoBar.snippets);

  const [index, setIndex] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareDialogIsOpen, setShareDialogIsOpen] = useState(false);
  const [shareMessageResponse, setShareMessageResponse] = useState<
    string | undefined
  >(undefined);

  const snippet = snippets[index];

  const getMoreSnippets = useCallback(async () => {
    setIsFetching(true);
    await dispatch(fetchSnippets());
    setIsFetching(false);
  }, [dispatch]);

  const handleCloseShareDialog = useCallback(() => {
    setShareDialogIsOpen(false);
    setShareMessageResponse(undefined);
  }, []);

  const handleOpenShareDialog = useCallback(() => {
    setShareDialogIsOpen(true);
  }, []);

  const handleShowNextSnippet = useCallback(async () => {
    const newIndex = index + 1;

    if (!snippets[newIndex]) {
      await getMoreSnippets();
    }

    setIndex(index + 1);
    setShareMessageResponse(undefined);
  }, [getMoreSnippets, index, snippets]);

  const handleSubmit = useCallback(async () => {
    const { id, image, title } = snippet;
    const message = stripHtml(title);

    setIsSharing(true);

    const response = await dispatch(
      shareContent({
        image,
        message,
        contentClass: "Sidebar",
        contentKey: id.toString(),
      })
    ).unwrap();

    setIsSharing(false);
    setShareMessageResponse(response.message);
  }, [dispatch, snippet]);

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
        onShare={handleOpenShareDialog}
        onShowNextSnippet={handleShowNextSnippet}
        title={title}
      />
      <ShareDialog
        onSubmit={handleSubmit}
        isOpen={shareDialogIsOpen}
        isSharing={isSharing}
        onRequestClose={handleCloseShareDialog}
        shareMessageResponse={shareMessageResponse}
        data={{
          description: snippet.description,
          image: snippet.image,
          name: snippet.title,
        }}
      />
    </Fragment>
  );
}

SnippetContainer.displayName = "SnippetContainer";

/*
class SnippetContainer extends Component {

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
    const contentClass = 'Sidebar';
    const contentKey = snippet.id;
    const image = snippet.image || null;
    const message = stripHtml(title);

    this.setState({ isSharing: true });

    const result = await dispatch(shareContent({
      contentClass,
      contentKey,
      image,
      message,
    }));

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

    const {
      description,
      title,
    } = snippet;

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

SnippetContainer.displayName = 'SnippetContainer';

SnippetContainer.propTypes = {
  snippets: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

const mapStateToProps = ({ infoBar: { snippets } }) => ({ snippets });

export default withRouter(connect(mapStateToProps)(SnippetContainer));

 */

import React from "react";
import PropTypes from "prop-types";
import ReactCSSTransitionReplace from "react-css-transition-replace";

import Buttonlet from "components/Buttonlet";

export default function SnippetComponent(props) {
  const { description, isFetching, title, onShare, onShowNextSnippet } = props;
  return (
    <div className="snippet">
      <ReactCSSTransitionReplace
        childComponent="div"
        transitionName="cross-fade"
        transitionEnterTimeout={200}
        transitionLeaveTimeout={200}
      >
        <div key={title}>
          <div className="snippet__edit-button-container">
            <Buttonlet disabled={isFetching} type="edit" onClick={onShare} />
          </div>
          <div key={title}>
            <p className="heading heading--3 snippet__heading">{title}</p>
            <p dangerouslySetInnerHTML={{ __html: description }} />
          </div>
        </div>
      </ReactCSSTransitionReplace>
      <div className="snippet__refresh-button-container">
        <Buttonlet
          disabled={isFetching}
          spin={isFetching}
          type="refresh"
          onClick={onShowNextSnippet}
        />
      </div>
    </div>
  );
}

SnippetComponent.propTypes = {
  description: PropTypes.string.isRequired,
  isFetching: PropTypes.bool.isRequired,
  onShare: PropTypes.func.isRequired,
  onShowNextSnippet: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

import React from 'react';
import PropTypes from 'prop-types';

const AccessCode = (props) => {
  const { accessCode } = props;

  return (
    <div className="media media--root" style={{ marginBottom: '18px' }}>
      <div className="media__left" />
      <div className="media__body">
        <h2 className="media__heading heading heading--2">You have sent your friend the following message:</h2>
        <p dangerouslySetInnerHTML={{ __html: accessCode.initialMessage }} />
        <a href={accessCode.shareUrl} target="_top">{accessCode.shareUrl}</a>
      </div>
    </div>
  );
};

AccessCode.propTypes = {
  accessCode: PropTypes.shape({
    initialMessage: PropTypes.string.isRequired,
    shareUrl: PropTypes.string.isRequired,
  }).isRequired,
};

export default AccessCode;

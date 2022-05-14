import React, { Fragment, useCallback, useEffect, useState } from 'react';
import Control from 'react-leaflet-control';
import Modal from 'react-modal';
import { Link, withRouter } from 'react-router-dom';

export function FunnellingIndicator() {
  const [didUserWantThis, setDidUserWantThis] = useState(true);
  const [didUserHideThis, setDidUserHideThis] = useState(true);
  const [isBumfModalOpen, setIsBumfModalOpen] = useState(false);

  useEffect(() => {
    setDidUserWantThis(window.localStorage.getItem('use-fallback-map') === 'true');
    setDidUserHideThis(window.localStorage.getItem('hide-funnelling-indicator') === 'true');
  }, []);

  const handleHide = useCallback((hideForever) => {
    setDidUserHideThis(hideForever);
    setIsBumfModalOpen(false);
    if (hideForever) {
      window.localStorage.setItem('hide-funnelling-indicator', 'true');
    }
  }, []);

  if (didUserWantThis || didUserHideThis) {
    return null;
  }

  return (
    <Fragment>
      <Control
        position="topleft"
      >
        <img
          alt="Funnelling indicator"
          className="fallback-map__funnelling-indicator"
          role="button"
          src={'/map/exclamation-icon.png'}
          onClick={() => setIsBumfModalOpen(true)}
        />
      </Control>
      <Modal
        isOpen={isBumfModalOpen}
        onRequestClose={() => setIsBumfModalOpen(false)}
        overlayClassName="modal--tooltip-like__overlay"
        className="modal--tooltip-like__content"
        style={{
          overlay: {
            zIndex: 9999,
          },
          content: {
            backgroundImage: 'none',
          },
        }}
      >
        <div>
          <p>
            Based on your browser, you are viewing the compatibility version of the Fallen London map.
          </p>
          <p>
            You can change this in
            {' '}
            <Link to="/account#map-settings">Account Settings</Link>
            .
          </p>
          <div className="buttons">
            <button
              className="button button--primary button--sm"
              onClick={() => handleHide(false)}
              style={{
                borderColor: '#92d1d5',
                color: '#92d1d5',
                textTransform: 'none',
              }}
            >
              OK
            </button>
            <button
              className="button button--tertiary button--sm"
              onClick={() => handleHide(true)}
              style={{
                borderColor: '#92d1d5',
                color: '#92d1d5',
                textTransform: 'none',
              }}
            >
              Don't show this again
            </button>
          </div>
        </div>
      </Modal>
    </Fragment>
  );
}

export default withRouter(FunnellingIndicator);

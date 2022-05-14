import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import Config from 'configuration';
import { IAppState } from 'types/app';
import { Z_INDEX_MAP_ADMIN_OVERLAY } from 'constants/z-indices';

interface Props {
  isMapVisible: boolean,
  zoomLevel?: number,
  lastClickX?: number,
  lastClickY?: number,
}

const AdminOverlay: React.FC<Props> = ({
  isMapVisible,
  lastClickX,
  lastClickY,
  zoomLevel,
}: Props) => {
  // hide the overlay in production and beta
  if (Config.environment === 'production' || Config.environment === 'beta' || !isMapVisible) {
    return null;
  }

  return (
    <div
      style={{
        background: '#ffffffa0',
        color: '#000',
        padding: '8px',
        position: 'absolute',
        top: '16px',
        right: '16px',
        zIndex: Z_INDEX_MAP_ADMIN_OVERLAY,
      }}
    >
      <table>
        <tbody>
          {zoomLevel && (
            <tr>
              <td>Zoom:</td>
              <td>{zoomLevel}</td>
            </tr>
          )}
          {(lastClickX && lastClickY) && (
            <Fragment>
              <tr>
                <td>last click X:</td>
                <td>{parseInt(lastClickX?.toFixed(0), 10)}</td>
              </tr>
              <tr>
                <td>last click Y:</td>
                <td>{-parseInt(lastClickY.toFixed(0), 10)}</td>
              </tr>
            </Fragment>
          )}
        </tbody>
      </table>
    </div>
  );
};

const mapStateToProps = ({
  mapAdmin: { lastClickX, lastClickY, zoomLevel },
  map: { isVisible: isMapVisible },
  user: { privilegeLevel },
}: IAppState) => ({
  isMapVisible,
  lastClickX,
  lastClickY,
  privilegeLevel,
  zoomLevel,
});

export default connect(mapStateToProps)(AdminOverlay);

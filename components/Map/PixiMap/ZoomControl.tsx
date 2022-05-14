import getMapZoomLimitsForSetting from 'features/mapping/getMapZoomLimitsForSetting';
import React from 'react';
import Control from 'react-leaflet-control';
import classnames from 'classnames';
import Loading from 'components/Loading';
import { connect } from 'react-redux';
import { IAppState } from 'types/app';
import { IMappableSetting } from 'types/map';
import {
  isRoughlyGTE,
  isRoughlyLTE,
} from 'utils';

export const DEFAULT_ZOOM_DELTA = 0.25;

export function ZoomControl({
  maxZoom,
  minZoom,
  spriteLoaderProgress,
  setting,
  setZoomLevel,
  zoomDelta,
  zoomLevel,
}: Props) {
  const { max: MAP_MAX_ZOOM, min: MAP_MIN_ZOOM } = getMapZoomLimitsForSetting(setting) ?? {};

  if (MAP_MAX_ZOOM === undefined || MAP_MIN_ZOOM === undefined) {
    return null;
  }

  const clampedMaxZoom = Math.min(MAP_MAX_ZOOM, maxZoom ?? MAP_MAX_ZOOM);
  const clampedMinZoom = Math.max(MAP_MIN_ZOOM, minZoom ?? MAP_MIN_ZOOM);

  if (clampedMinZoom === undefined) {
    return null;
  }

  return (
    <Control position="topleft">
      <div style={{ display: 'flex' }}>
        <div>
          <img
            alt="Zoom in"
            src={'/map/zoom-plus.png'} // eslint-disable-line react/jsx-curly-brace-presence
            className={classnames(
              'leaflet-control--custom-zoom',
              isRoughlyGTE(zoomLevel, clampedMaxZoom) && 'leaflet-control--custom-zoom--disabled',
            )}
            onClick={() => {
              setZoomLevel(
                Math.min(clampedMaxZoom, zoomLevel + (zoomDelta ?? DEFAULT_ZOOM_DELTA)),
                'in',
              );
            }}
          />
          <img
            alt="Zoom out"
            src={'/map/zoom-minus.png'} // eslint-disable-line react/jsx-curly-brace-presence
            className={classnames(
              'leaflet-control--custom-zoom',
              isRoughlyLTE(zoomLevel, clampedMinZoom) && 'leaflet-control--custom-zoom--disabled',
            )}
            onClick={() => {
              setZoomLevel(
                Math.max(clampedMinZoom, zoomLevel - (zoomDelta ?? DEFAULT_ZOOM_DELTA)),
                'out',
              );
            }}
          />
        </div>
        {spriteLoaderProgress < 100 && (
          <div
            style={{
              display: 'flex',
              marginLeft: '8px',
              marginTop: '10px',
              pointerEvents: 'none',
            }}
          >
            <Loading
              spinner
              style={{ height: '28px', marginTop: 0 }}
            />
            <div
              style={{
                marginLeft: '4px',
              }}
            >
              <div>
                Loading images...
              </div>
              <div
                className="progress-bar"
                style={{
                  borderBottom: 'none',
                  margin: 0,
                  padding: '2px 0',
                  width: '100px',
                }}
              >
                <span
                  className={classnames(
                    'progress-bar__stripe',
                    'progress-bar__stripe--has-transition',
                  )}
                  style={{
                    transition: 'width .4s ease-out',
                    width: spriteLoaderProgress,
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </Control>
  );
}

const mapStateToProps = ({
  map: { setting },
  spriteLoader: { progress: spriteLoaderProgress },
}: IAppState) => ({
  spriteLoaderProgress,
  setting: setting as IMappableSetting,
});

interface Props extends ReturnType<typeof mapStateToProps> {
  setZoomLevel: (zoomLevel: number, direction?: 'in' | 'out') => void,
  zoomLevel: number,
  maxZoom?: number,
  minZoom?: number,
  zoomDelta?: number,
}

export default connect(mapStateToProps)(ZoomControl);
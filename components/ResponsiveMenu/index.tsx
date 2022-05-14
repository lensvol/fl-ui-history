import React, {
  useCallback,
  useMemo,
} from 'react';
import ReactCSSTransitionReplace from 'react-css-transition-replace';
import classnames from 'classnames';
import MediaSmDown from 'components/Responsive/MediaSmDown';
import {
  connect,
  useDispatch,
} from 'react-redux';
import {
  withRouter,
  RouteComponentProps,
} from 'react-router-dom';

import {
  fetch as fetchMap,
  toggleMapView,
} from 'actions/map';
import { openSidebar } from 'actions/sidebar';

import { IAppState } from 'types/app';
import getImagePath from 'utils/getImagePath';

function ResponsiveMenuContainer(props: Props) {
  const {
    currentArea,
    phase,
    setting,
    shouldMapUpdate,
    location: { pathname },
  } = props;

  const dispatch = useDispatch();

  const backgroundImage = useMemo(() => `${getImagePath({ icon: currentArea?.image, type: 'header' })}`, [currentArea]);

  const isMapEnabled = useMemo(() => (
    (setting?.canOpenMap ?? false) && phase === 'Available' && pathname === '/'
  ), [pathname, phase, setting]);

  const mapTitle = useMemo(() => {
    if (setting?.canOpenMap && phase === 'Available') {
      return 'Map';
    }
    return 'Map - you cannot move right now';
  }, [phase, setting]);

  const onOpenSidebar = useCallback(() => dispatch(openSidebar()), [dispatch]);

  const onToggleMap = useCallback(() => {
    if (!isMapEnabled) {
      return;
    }
    if (shouldMapUpdate) {
      dispatch(fetchMap());
    }
    dispatch(toggleMapView());
  }, [dispatch, isMapEnabled, shouldMapUpdate]);

  return (
    <ReactCSSTransitionReplace
      // eslint-disable-next-line
      // @ts-ignore
      childComponent="div"
      transitionName="fade"
      transitionEnterTimeout={1000}
      transitionLeaveTimeout={1000}
    >
      <nav
        key={backgroundImage}
        className="banner banner--md-down"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <ul className="banner__list--md-down">
          <li className="banner-item">
            <button
              title="Menu"
              className="button--link banner__button"
              onClick={onOpenSidebar}
              type="button"
            >
              <i className="fa fa-bars fa-3x" />
              <span className="u-visually-hidden">Menu</span>
            </button>
          </li>
          <MediaSmDown>
            <li className="banner-item">
              <button
                className="button--link banner__button"
                title={mapTitle}
                onClick={onToggleMap}
                type="button"
              >
                <i
                  className={classnames(
                    'fa fa-compass fa-3x',
                    'icon--has-transition',
                    !isMapEnabled && 'icon--disabled',
                  )}
                />
                <span className="u-visually-hidden">Map</span>
              </button>
            </li>
          </MediaSmDown>
        </ul>
      </nav>
    </ReactCSSTransitionReplace>
  );
}

const mapStateToProps = ({
  storylet: { phase },
  map: {
    currentArea,
    setting,
    shouldUpdate: shouldMapUpdate,
  },
}: IAppState) => ({
  shouldMapUpdate,
  currentArea,
  phase,
  setting,
});

type Props = ReturnType<typeof mapStateToProps> & RouteComponentProps;

export default withRouter(connect(mapStateToProps)(ResponsiveMenuContainer));

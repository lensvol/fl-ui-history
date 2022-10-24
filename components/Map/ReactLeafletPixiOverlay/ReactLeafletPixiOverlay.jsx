/* eslint-disable no-underscore-dangle */
import * as PropTypes from "prop-types";
import { connect } from "react-redux";
import { MapLayer, withLeaflet } from "react-leaflet";
import {
  EVENT_TYPE_AREAS,
  EVENT_TYPE_SELECTED_AREA,
} from "components/Map/ReactLeafletPixiOverlay/event-types";
import {
  isDrawable,
  isLodgings,
  sortByLayerWithDestinationsLast,
} from "features/mapping";
import getStateAwareAreas from "selectors/map/getStateAwareAreas";
import redrawCallback from "./redrawCallback";
import LeafletPixiOverlay from "./LeafletPixiOverlay";

export class ReactLeafletPixiOverlay extends MapLayer {
  static displayName = "ReactLeafletPixiOverlay";

  static propTypes = {
    selectedArea: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  };

  componentDidMount() {
    const { areas } = this.props;
    const filteredAreas = [...areas]
      .sort(sortByLayerWithDestinationsLast)
      .filter((a) => isDrawable(a) && !isLodgings(a));
    this.layerContainer.addLayer(this.leafletElement);
    this.leafletElement.redraw({
      type: EVENT_TYPE_AREAS,
      payload: { areas: filteredAreas },
    });
  }

  componentWillUnmount() {
    this.layerContainer.removeLayer(this.leafletElement);
  }

  // eslint-disable-next-line class-methods-use-this
  createLeafletElement() {
    return new LeafletPixiOverlay(redrawCallback, { doubleBuffering: false });
  }

  updateLeafletElement(fromProps, toProps) {
    // We only care about the selected area here. (For now.)
    if (fromProps.selectedArea === toProps.selectedArea) {
      return;
    }
    const { selectedArea, setting } = toProps;
    const zoomLevel = this.leafletElement._map.getZoom();
    this.leafletElement.redraw({
      type: EVENT_TYPE_SELECTED_AREA,
      payload: { selectedArea, setting, zoomLevel },
    });
  }
}

const mapStateToProps = (state) => ({
  areas: getStateAwareAreas(state),
  setting: state.map.setting,
});

export default connect(mapStateToProps)(withLeaflet(ReactLeafletPixiOverlay));

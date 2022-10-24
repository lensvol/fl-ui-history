import {
  EVENT_TYPE_ADD,
  EVENT_TYPE_AREAS,
  EVENT_TYPE_SELECTED_AREA,
} from "components/Map/ReactLeafletPixiOverlay/event-types";
import {
  AreasPayload,
  IEvent,
  IUtils,
  SelectedAreaPayload,
} from "components/Map/ReactLeafletPixiOverlay/types";

function _log(message: string) {
  // console.info(message);
}

export default function redrawCallback(utils: IUtils, event: IEvent) {
  switch (event.type) {
    case EVENT_TYPE_ADD:
      return;
    case EVENT_TYPE_AREAS:
      onAreas(utils, event.payload as AreasPayload);
      return;
    case EVENT_TYPE_SELECTED_AREA:
      onSelectedArea(utils, event.payload as SelectedAreaPayload);
      return;
    default:
      utils.getRenderer().render(utils.getContainer());
      return;
  }
}

function onAreas(utils: IUtils, payload: object) {
  const startAt = window.performance.now();
  const { areas } = payload as AreasPayload;
  utils.addAreas(areas);
  _log(
    `RedrawCallback.onAreas() took ${(
      (window.performance.now() - startAt) /
      1000
    ).toFixed(2)} s`
  );
}

function onSelectedArea(utils: IUtils, payload: SelectedAreaPayload) {
  const startAt = window.performance.now();
  const { selectedArea, setting, zoomLevel } = payload;
  utils.setSelectedArea(selectedArea, setting, zoomLevel);
  _log(
    `RedrawCallback.onSelectedArea(zoomLevel=${zoomLevel}) took ${(
      (window.performance.now() - startAt) /
      1000
    ).toFixed(2)} s`
  );
}

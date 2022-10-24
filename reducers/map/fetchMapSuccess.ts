import { FetchMapSuccess } from "actions/map/fetch";
import asStateAwareArea from "features/mapping/asStateAwareArea";
import { AreaWithNestedJsonInfo, IMappableSetting, IMapState } from "types/map";

export default function fetchMapSuccess(
  state: IMapState,
  { payload }: FetchMapSuccess
) {
  const { currentArea, areas } = payload;

  const flattenedAreas = flattenAreas(areas);

  const flattenedStateAwareAreas = flattenedAreas
    .map((area) => ({ ...area, ...area.jsonInfo }))
    .map((a) =>
      asStateAwareArea(
        a,
        flattenedAreas,
        state.setting as IMappableSetting,
        currentArea
      )
    );

  const currentAreaWithJsonInfo = asStateAwareArea(
    { ...currentArea, ...(currentArea.jsonInfo ?? {}) },
    flattenedStateAwareAreas,
    state.setting as IMappableSetting,
    currentArea
  );

  return {
    ...state,
    currentArea: currentAreaWithJsonInfo,
    areas: flattenedStateAwareAreas,
    isFetching: false,
    shouldUpdate: false,
  };
}

function flattenAreas(
  areas: AreaWithNestedJsonInfo[]
): AreaWithNestedJsonInfo[] {
  return areas.flatMap((a) => {
    if (a.childAreas && a.childAreas.length) {
      return [a, ...flattenAreas(a.childAreas)];
    }
    return [a];
  });
}

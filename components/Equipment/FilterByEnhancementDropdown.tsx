import React, { useCallback, useMemo } from "react";
import { connect } from "react-redux";
import { withFeature } from "flagged";
import Select from "react-select";

import { FILTER_ENHANCEMENTS } from "features/feature-flags";
import { ThunkDispatch } from "redux-thunk";
import getEnhancements from "selectors/possessions/getFilterableEnhancements";
import { IAppState } from "types/app";
import { selectedEnhancementQualityChanged } from "actions/equipment";
import { QUALITY_ID_DUMMY_SHOW_ALL_ITEMS } from "components/Equipment/constants";
import * as DropdownStyles from "./dropdown-styles";

const OPTION_SHOW_ALL = {
  qualityId: QUALITY_ID_DUMMY_SHOW_ALL_ITEMS,
  qualityName: "All",
  category: "this is not a category",
  level: 0,
};

function FilterByEnhancementDropDown({
  dispatch,
  enhancements,
  selectedEnhancementQualityId,
}: Props) {
  const onChange = useCallback(
    ({ qualityId }) => {
      if (Number.isNaN(qualityId)) {
        console.error(`Tried to filter on enhancement ID '${qualityId}'`);
        return;
      }
      dispatch(selectedEnhancementQualityChanged(qualityId));
    },
    [dispatch]
  );

  // Map qualities to something we can use as values in a select
  const options = useMemo(
    () =>
      [
        OPTION_SHOW_ALL,
        ...enhancements.map((e) => ({
          ...e,
          qualityName: e.qualityName.replace(/:$/, ""),
        })),
      ].map((e) => ({
        label: e.qualityName,
        value: e.qualityId,
        qualityId: e.qualityId,
        category: e.category,
      })),
    [enhancements]
  );

  // Find the selected option and pass it needsSeparator: false (this is really only necessary to satisfy
  // type requirements)
  const selectedOption = useMemo(() => {
    const e = options.find((o) => o.qualityId === selectedEnhancementQualityId);
    if (e === undefined) {
      return undefined;
    }
    return { ...e, needsSeparator: false };
  }, [options, selectedEnhancementQualityId]);

  // Add separators at category boundaries
  const filteredOptionsWithSeparators = useMemo(
    () =>
      options
        .filter((o) => o.qualityId !== selectedEnhancementQualityId)
        .map((e, idx, src) => {
          // Don't show a separator above the first category
          const needsSeparator =
            idx > 0 &&
            e.category !== src[idx - 1].category &&
            (idx > 1 ||
              selectedEnhancementQualityId !== QUALITY_ID_DUMMY_SHOW_ALL_ITEMS);
          return { ...e, needsSeparator };
        }),
    [options, selectedEnhancementQualityId]
  );

  return (
    <Select
      isClearable={false}
      isSearchable={false}
      value={selectedOption}
      options={filteredOptionsWithSeparators}
      onChange={onChange}
      theme={DropdownStyles.theme}
      styles={DropdownStyles.styles}
      components={{
        IndicatorSeparator: () => null,
      }}
    />
  );
}

const mapStateToProps = (state: IAppState) => ({
  enhancements: getEnhancements(state),
  selectedEnhancementQualityId: state.equipment.selectedEnhancementQualityId,
});

interface Props extends ReturnType<typeof mapStateToProps> {
  dispatch: ThunkDispatch<any, any, any>;
}

export default withFeature(FILTER_ENHANCEMENTS)(
  connect(mapStateToProps)(FilterByEnhancementDropDown)
);

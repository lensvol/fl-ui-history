import React, { useCallback, useMemo } from "react";

import Select from "react-select";

import * as DropdownStyles from "components/Equipment/dropdown-styles";

import { useAppSelector } from "features/app/store";

type SelectOption = {
  label: string;
  value: string;
  needsSeparator: boolean;
};

export const SHOW_ALL_AGENTS = "All";

const OPTION_SHOW_ALL: SelectOption = {
  label: "All",
  value: SHOW_ALL_AGENTS,
  needsSeparator: false,
};

type Props = {
  category: string;
  setCategory: (value: string) => void;
};

export default function AgentFilter({ category, setCategory }: Props) {
  const agents = useAppSelector((state) => state.agents.agents);
  const levels = agents
    .flatMap((a) => a.levels)
    .filter((level) => level.category === "ConcernStat");

  const onChange = useCallback(
    (option: SelectOption) => {
      setCategory(option.value);
    },
    [setCategory]
  );

  // Generate dropdown contents
  const options = useMemo(
    () => [
      OPTION_SHOW_ALL,
      ...levels
        .sort((a, b) => (a.name > b.name ? 1 : -1))
        .map(
          (e, idx) =>
            ({
              label: e.name,
              value: e.name,
              needsSeparator: idx === 0,
            }) as SelectOption
        )
        .reduce((accumulator: SelectOption[], option: SelectOption) => {
          if (
            accumulator.length === 0 ||
            accumulator[accumulator.length - 1].label !== option.label
          ) {
            accumulator.push(option);
          }

          return accumulator;
        }, []),
    ],
    [levels]
  );

  const selectedOption = useMemo(() => {
    return options.find((o) => o.value === category);
  }, [options, category]);

  const visibleOptions = options.filter((o) => o.value !== category);

  return (
    <Select
      isClearable={false}
      isSearchable={false}
      value={selectedOption}
      options={visibleOptions}
      onChange={onChange}
      theme={DropdownStyles.theme}
      styles={DropdownStyles.styles}
      components={{
        IndicatorSeparator: () => null,
      }}
    />
  );
}

AgentFilter.displayName = "AgentFilter";

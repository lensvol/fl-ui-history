import { ITooltipData } from "components/ModalTooltip/types";

import { ICard } from "types/cards";

type Props = {
  action: () => any;
  data: ITooltipData & Pick<ICard, "unlockedWithDescription" | "teaser">;
};

export default function makeTooltipData({ action, data }: Props): ITooltipData {
  return {
    secondaryDescription: data.unlockedWithDescription,
    name: data.name,
    description: data.teaser,
    smallButtons: data.smallButtons ?? [
      {
        action,
        label: "play",
      },
    ],
  };
}

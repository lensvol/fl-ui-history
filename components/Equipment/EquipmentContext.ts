import { createContext } from "react";
import { IQuality } from "types/qualities";

export type EquipmentContextValue = {
  controlIds: {
    equipmentSearchId: string;
    outfitDropdownId: string;
  };
  filterString: string;
  onFilter: (s: string) => void;
  openUseOrEquipModal: (
    q: Pick<IQuality, "id" | "image" | "name">,
    equipped: boolean
  ) => void;
};

const EquipmentContext = createContext<EquipmentContextValue>({
  filterString: "",
  onFilter: (_) => {
    /* */
  },
  openUseOrEquipModal: (_) => {
    /* */
  },
  controlIds: {
    outfitDropdownId: "outfit-dropdown-id",
    equipmentSearchId: "equipment-search-id",
  },
});

EquipmentContext.displayName = "EquipmentContext";

export default EquipmentContext;

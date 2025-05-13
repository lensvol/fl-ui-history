import React from "react";

import classnames from "classnames";

import getAgentNames from "components/Agents/getAgentNames";
import Image from "components/Image";

import { Agent, PlotHint } from "types/agents";
import { IEnhancement, IQuality } from "types/qualities";

interface Props {
  agent: Agent;
  handleClick: (item?: IQuality) => void;
  hints: PlotHint[];
  item: LoanableItem;
}

export type LoanableItem = IQuality & {
  borrowers: Agent[];
  isWorn: boolean;
};

export default function AgentInventoryItemPickerEntry({
  agent,
  handleClick,
  hints,
  item,
}: Props) {
  return (
    <div className="agent-inventory-picker__item">
      <Image
        icon={item.image}
        alt={item.name}
        defaultCursor={!isItemLoanable(agent, item)}
        type="small-icon"
        onClick={
          isItemLoanable(agent, item) ? () => handleClick(item) : () => {}
        }
        style={{
          imageRendering: "auto",
        }}
        className={classnames(
          !isAgentBorrowingItem(agent, item) &&
            !isItemLoanable(agent, item) &&
            "icon--locked",
          isAgentBorrowingItem(agent, item) &&
            "agent-inventory-picker__lent-item",
          !isAgentBorrowingItem(agent, item) &&
            getBestHintedSortLevel(item, hints) > 0 &&
            "agent-inventory-picker__hinted-item",
          item.isOutfit && "agent-inventory-picker__outfit-item"
        )}
        tooltipData={{
          description: item.description,
          name: [
            item.name,
            item.levelDescription ? `— ${item.levelDescription}` : "",
          ].join(" "),
          secondaryDescription: getSecondaryDescription(agent, item),
          enhancements: item.enhancements,
          smallButtons: isItemLoanable(agent, item)
            ? [
                {
                  label: "Equip",
                  action: () => handleClick(item),
                },
              ]
            : [],
        }}
      />
    </div>
  );
}

AgentInventoryItemPickerEntry.displayName = "AgentInventoryItemPickerEntry";

type SecondaryDescriptionParts = {
  className: string;
  message: string;
};

function getBestHintedSortLevel(item: LoanableItem, hints: PlotHint[]) {
  return Math.max(
    ...hints.map((hint) =>
      getHintedSortLevel(
        item.enhancements?.find((enh) => enh.qualityId === hint.qualityId)
      )
    )
  );
}

function getHintedSortLevel(enhancement?: IEnhancement) {
  return (
    (enhancement?.level ?? 0) *
    ((enhancement?.category ?? "") === "Skills" ? 10 : 1)
  );
}

function isAgentBorrowingItem(agent: Agent, item: LoanableItem) {
  return item.borrowers.map((b) => b.id).includes(agent.id);
}

function isItemLoanable(agent: Agent, item: LoanableItem) {
  if (isAgentBorrowingItem(agent, item)) {
    // this agent already has this item
    return false;
  }

  return item.borrowers.filter((b) => b.plot).length < item.level;
}

function getSecondaryDescription(agent: Agent, item: LoanableItem) {
  const secondaryDescription = getSecondaryDescriptionParts(agent, item);

  const description =
    "<span class='" +
    secondaryDescription.className +
    "'>" +
    secondaryDescription.message +
    "</span>";

  if (item.isOutfit) {
    return description + " This item is assigned to an outfit.";
  }

  return description;
}

function getSecondaryDescriptionParts(
  agent: Agent,
  item: LoanableItem
): SecondaryDescriptionParts {
  const DefaultStyle = "agent-inventory-picker__secondary-description";

  const AlertStyle = DefaultStyle + "-alert";
  const BorrowedStyle = DefaultStyle + "-borrowed";
  const WornStyle = DefaultStyle + "-worn";

  if (isAgentBorrowingItem(agent, item)) {
    // this agent already has this item
    return {
      className: BorrowedStyle,
      message: `${agent.name} has already equipped this item.`,
    };
  }

  if (item.level === 0) {
    // should be unreachable: item is in your inventory, but also you don't have any of it?
    return {
      className: AlertStyle,
      message: "You do not own this item.",
    };
  }

  // these agents get to keep their items because they're away on a plot
  const workingAgents = item.borrowers.filter((b) => b.plot);

  if (workingAgents.length >= item.level) {
    // all copies are off-limits
    return {
      className: AlertStyle,
      message: `You cannot loan out this item because it is currently equipped by ${getAgentNames(workingAgents)}.`,
    };
  }

  // how many of this item are neither worn nor loaned out to other agents?
  const unclaimedCount =
    item.level - item.borrowers.length - (item.isWorn ? 1 : 0);

  // we can loan out an item without affecting anyone else's inventory
  if (unclaimedCount > 0) {
    const are = unclaimedCount === 1 ? "is" : "are";
    const unclaimedPrefix = `There ${are} ${unclaimedCount} of this item you can loan out`;

    if (item.borrowers.length === 0) {
      if (item.isWorn) {
        // you're wearing this item, but have more to loan out
        return {
          className: WornStyle,
          message: `${unclaimedPrefix}, in addition to the one you have equipped.`,
        };
      }

      // item is not worn by anyone
      return {
        className: DefaultStyle,
        message: `${unclaimedPrefix}.`,
      };
    }

    if (item.isWorn) {
      // you're wearing this, 1 or more of your agents are wearing it, and there are more to go around
      return {
        className: DefaultStyle,
        message:
          unclaimedPrefix +
          ", in addition to the ones equipped by " +
          item.borrowers.map((b) => b.name).join(", ") +
          (item.borrowers.length > 1 ? "," : "") +
          " and yourself.",
      };
    }

    // you're not wearing this, but 1 or more of your agents are; there are more to go around
    const one = item.borrowers.length === 1 ? "one" : "ones";

    return {
      className: DefaultStyle,
      message: `${unclaimedPrefix}, in addition to the ${one} equipped by ${getAgentNames(item.borrowers)}.`,
    };
  }

  // loaning out this item means taking it away from someone else
  if (item.borrowers.length === 0) {
    if (item.isWorn) {
      // you're wearing the only instance of this item
      return {
        className: WornStyle,
        message: "This item is currently equipped by you.",
      };
    }

    // should be unreachable: item is in your inventory, but you don't have any of it
    return {
      className: AlertStyle,
      message: "You do not own this item.",
    };
  }

  const freeAgents = item.borrowers.filter((b) => !b.plot);

  if (freeAgents.length === 0) {
    if (item.isWorn) {
      // agents have taken your items out on a plot, but you're also wearing one
      return {
        className: BorrowedStyle,
        message:
          "This item is currently equipped by you, as well as " +
          getAgentNames(item.borrowers) +
          ".",
      };
    }

    // should be unreachable: previous checks eliminate this possibility
    return {
      className: AlertStyle,
      message: "You do not have this item.",
    };
  }

  const freeAgent = freeAgents[0];
  const resortedAgents = [
    freeAgent,
    ...item.borrowers.filter((b) => b.id !== freeAgent.id),
  ];

  if (item.isWorn) {
    // you're wearing this, and your agents are wearing all of the other copies
    return {
      className: AlertStyle,
      message: `This item is currently equipped by ${getAgentNames(resortedAgents)}, as well as yourself.`,
    };
  }

  // you've loaned out all copies of this item to your agents
  return {
    className: AlertStyle,
    message: `This item is currently equipped by ${getAgentNames(resortedAgents)}.`,
  };
}

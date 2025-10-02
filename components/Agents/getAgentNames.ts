import { Agent } from "types/agents";

export default function getAgentNames(agents: Agent[]) {
  switch (agents.length) {
    case 0:
      return "";

    case 1:
      return agents[0].name;

    case 2:
      return agents[0].name + " and " + agents[1].name;

    default:
      return [
        ...agents.slice(0, agents.length - 1).map((b) => b.name),
        "and " + agents[agents.length - 1].name,
      ].join(", ");
  }
}

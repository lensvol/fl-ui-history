import { AgentLevel } from "types/agents";

export function agentBonusToString(level?: AgentLevel) {
  if (!level) {
    return "";
  }

  if (level.level === 0 && level.bonus === 0) {
    return `+0`;
  }

  if (level.bonus > 0) {
    return `+${level.bonus}`;
  }

  if (level.bonus < 0) {
    return `-${-level.bonus}`;
  }

  return "";
}

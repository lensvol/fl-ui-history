import React from "react";
import { CurrencyCode } from "types/payment";

const CODES: CurrencyCode[] = ["USD", "GBP", "EUR", "AUD", "CAD", "SEK", "RUB"];

type Props = {
  value: CurrencyCode | undefined;
  onChange: (_args?: any) => void;
};

export default function CurrencySelector({ value, onChange }: Props) {
  const codesWithPrompt = [
    { label: "Select a currency", value: undefined },
    ...CODES.map((c) => ({ label: c, value: c })),
  ];
  return (
    <select
      name="currencyCode"
      id="currency-code"
      style={{ border: "2px solid #666666", borderRadius: 2, marginLeft: 8 }}
      onChange={onChange}
      value={value}
    >
      {codesWithPrompt.map((code) => (
        <option key={code.value ?? "prompt"} value={code.value}>
          {code.label}
        </option>
      ))}
    </select>
  );
}

CurrencySelector.displayName = "CurrencySelector";

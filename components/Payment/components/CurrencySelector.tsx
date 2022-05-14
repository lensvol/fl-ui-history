import React from 'react';
import PropTypes from 'prop-types';
import { CurrencyCode } from 'types/payment';


const CODES: CurrencyCode[] = [
  'USD',
  'GBP',
  'EUR',
  'AUD',
  'CAD',
  'SEK',
  'RUB',
];

type Props = {
  value: CurrencyCode,
  onChange: (_args?: any) => void,
};

export default function CurrencySelector({ value, onChange }: Props) {
  return (
    <select
      name="currencyCode"
      id="currency-code"
      style={{ border: '2px solid #666666', borderRadius: 2, marginLeft: 8 }}
      onChange={onChange}
      value={value}
    >
      {CODES.map(code => <option key={code} value={code}>{code}</option>)}
    </select>
  );
}

CurrencySelector.displayName = 'CurrencySelector';

CurrencySelector.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};
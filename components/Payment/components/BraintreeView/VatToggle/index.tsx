import { FEATURE_SHOW_VAT_BREAKDOWN } from 'features/feature-flags';
import React from 'react';
import { Feature } from 'flagged';

export default function VatToggle({ onToggle }: { onToggle: () => void }) {
  return (
    <p style={{ fontStyle: 'italic', fontSize: 'small' }}>
      * Prices include VAT for EU countries.
      <Feature name={FEATURE_SHOW_VAT_BREAKDOWN}>
        {(enabled: boolean) => {
          if (!enabled) {
            return null;
          }
          return (
            <>
              Click
              {' '}
              <button
                type="button"
                className="link--inverse"
                onClick={onToggle}
              >
                here
              </button>
              {' '}
              to display details.
            </>
          );
        }}
      </Feature>
    </p>
  );
}

VatToggle.displayName = 'VatToggle';

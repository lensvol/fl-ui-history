import React from 'react';

export default function CombinedMessage({ flavour, result, success }) {
  const failureText = 'A regret!';
  const successText = 'Congratulations, friend!';
  return (
    <div style={{ marginBottom: '1rem' }}>
      <h1 className="heading heading--1">
        {success ? successText : failureText}
      </h1>
      <div dangerouslySetInnerHTML={{ __html: result }} />
    </div>
  );
}

CombinedMessage.displayName = 'CombinedMessage';
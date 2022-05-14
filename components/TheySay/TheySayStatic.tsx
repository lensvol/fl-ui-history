import React from 'react';

export default function TheySayStatic({ description }: { description: string }) {
  return (
    <p>
      <span className="they-say__quote">“</span>
      <span>{description}</span>
      <span className="they-say__quote">”</span>
    </p>
  );
}

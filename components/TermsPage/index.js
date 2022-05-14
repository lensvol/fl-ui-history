import React from 'react';
import Header from 'components/Header';
import Terms from 'components/Terms';
import Footer from 'components/Footer';

export default function TermsContainer() {
  return (
    <div>
      <Header />
      <Terms />
      <Footer />
    </div>
  );
}

TermsContainer.displayName = 'TermsContainer';

import React from 'react';
import Header from 'components/Header';
import Privacy from 'components/Privacy';
import Footer from 'components/Footer';

export default function PrivacyContainer() {
  return (
    <div>
      <Header />
      <Privacy />
      <Footer />
    </div>
  );
}

PrivacyContainer.displayName = 'PrivacyContainer';

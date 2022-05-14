import React from 'react';
import { MessageVia } from 'services/SettingsService';
import EmailAuthStatus from './EmailAuthStatus';
import FacebookAuthStatus from './FacebookAuthStatus';
import TwitterAuthStatus from './TwitterAuthStatus';
import GoogleAuthStatus from './GoogleAuthStatus';

export default function AuthStatus({ method }: { method: MessageVia }) {
  switch (method) {
    case 'Email':
      return <EmailAuthStatus />;
    case 'Facebook':
      return <FacebookAuthStatus />;
    case 'Google':
      return <GoogleAuthStatus />;
    case 'Twitter':
      return <TwitterAuthStatus />;
    default:
      return null;
  }
}
import React from 'react';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

interface ToastProps {
  message: string | null;
  kind?: 'success' | 'warn';
}

export const Toast: React.FC<ToastProps> = ({ message, kind = 'success' }) => {
  if (!message) return null;

  return (
    <div className={`toast show ${kind === 'warn' ? 'warn' : ''}`} role="status" aria-live="polite">
      {kind === 'warn' ? <AlertTriangle aria-hidden="true" /> : <CheckCircle2 aria-hidden="true" />}
      <span>{message}</span>
    </div>
  );
};

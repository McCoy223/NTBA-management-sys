import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
  onResetKey: () => void;
  fallbackComponent?: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class ClerkErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMessage: ''
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      errorMessage: error?.message || 'An error occurred during Clerk authentication initialization.'
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Clerk runtime error caught by boundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallbackComponent) {
        return this.props.fallbackComponent;
      }
      return (
        <div style={{ padding: '32px 24px', maxWidth: '640px', margin: '40px auto', background: '#fff', borderRadius: '16px', boxShadow: '0 12px 36px rgba(0,0,0,0.1)', border: '1px solid #fee2e2' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px', color: '#dc2626' }}>
            <AlertCircle style={{ width: '28px', height: '28px' }} />
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Clerk Authentication Notice</h3>
          </div>
          <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.6, marginBottom: '16px' }}>
            {this.state.errorMessage}
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              onClick={() => {
                this.setState({ hasError: false, errorMessage: '' });
                this.props.onResetKey();
              }}
            >
              <RotateCcw style={{ width: '14px', height: '14px' }} />
              Reset Key & Switch to Demo Mode
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => window.location.reload()}
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

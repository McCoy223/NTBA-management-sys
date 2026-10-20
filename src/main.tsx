import React, { Component, ErrorInfo, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './styles/app.css';

interface RootErrorBoundaryProps {
  children: ReactNode;
}

interface RootErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

class RootErrorBoundary extends Component<RootErrorBoundaryProps, RootErrorBoundaryState> {
  public state: RootErrorBoundaryState = {
    hasError: false,
    errorMessage: ''
  };

  public static getDerivedStateFromError(error: Error): RootErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error?.message || 'An unexpected error occurred during application startup.'
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('RootErrorBoundary caught error:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {}
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f4f8fd',
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
          padding: '24px'
        }}>
          <div style={{
            maxWidth: '560px',
            width: '100%',
            background: '#ffffff',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 12px 36px rgba(0,0,0,0.1)',
            border: '1px solid #fee2e2'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px', color: '#dc2626' }}>
              <span style={{ fontSize: '26px' }}>⚠️</span>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>School Portal Notice</h2>
            </div>
            <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.6, margin: '0 0 20px' }}>
              {this.state.errorMessage}
            </p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={this.handleReset}
                style={{
                  padding: '10px 18px',
                  background: '#073a78',
                  color: '#fff',
                  border: 0,
                  borderRadius: '8px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: '13px'
                }}
              >
                Reset Saved Data &amp; Reload
              </button>
              <button
                type="button"
                onClick={() => window.location.reload()}
                style={{
                  padding: '10px 18px',
                  background: '#f1f5f9',
                  color: '#334155',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '13px'
                }}
              >
                Reload
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <RootErrorBoundary>
        <App />
      </RootErrorBoundary>
    </React.StrictMode>
  );
}

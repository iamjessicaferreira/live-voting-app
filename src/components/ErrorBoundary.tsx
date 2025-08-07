'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Refresh, BugReport } from '@mui/icons-material';

interface Props {
  children: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorId: string;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorId: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorId: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.props.onError?.(error, errorInfo);

    // In a real application, you would send this to an error reporting service
    // const errorReport = {
    //   errorId: this.state.errorId,
    //   error: error.message,
    //   stack: error.stack,
    //   componentStack: errorInfo.componentStack,
    //   timestamp: new Date().toISOString(),
    // };
  }

  handleRefresh = () => {
    window.location.reload();
  };

  handleReportError = () => {
    const { error } = this.state;
    if (error) {
      // In a real application, you would send this to an error reporting service
      // const errorReport = {
      //   errorId: this.state.errorId,
      //   error: error.message,
      //   stack: error.stack,
      //   timestamp: new Date().toISOString(),
      // };
    }
  };

  render() {
    if (this.state.hasError) {
      const { error, errorId } = this.state;

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="mb-6">
              <div className="text-6xl mb-4">😵</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h1>
              <p className="text-gray-600 mb-4">
                We encountered an unexpected error. Don&apos;t worry, our team has been notified.
              </p>
              {errorId && <p className="text-xs text-gray-500 mb-4">Error ID: {errorId}</p>}
            </div>

            <div className="space-y-3">
              <button
                onClick={this.handleRefresh}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <Refresh className="mr-2" />
                Refresh Page
              </button>

              <button
                onClick={this.handleReportError}
                className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
              >
                <BugReport className="mr-2" />
                Report Issue
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm font-medium text-gray-700 mb-2">
                  Error Details (Development)
                </summary>
                <div className="bg-gray-100 p-3 rounded text-xs font-mono text-gray-800 overflow-auto">
                  <div className="mb-2">
                    <strong>Error:</strong> {error.message}
                  </div>
                  {error.stack && (
                    <div>
                      <strong>Stack:</strong>
                      <pre className="whitespace-pre-wrap mt-1">{error.stack}</pre>
                    </div>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

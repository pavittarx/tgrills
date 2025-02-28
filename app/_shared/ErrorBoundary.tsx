"use client";

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { 
      hasError: false 
    };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to console for debugging
    console.error("Uncaught error:", error);
    console.error("Error Info:", errorInfo);

    // Update state with error details
    this.setState({ 
      hasError: true, 
      error, 
      errorInfo 
    });
  }

  render() {
    if (this.state.hasError) {
      // Render a fallback UI
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-red-50 p-4">
          <div className="bg-white shadow-xl rounded-lg p-6 max-w-xl w-full">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Something Went Wrong
            </h1>
            <div className="bg-red-100 p-4 rounded-md overflow-auto max-h-[400px]">
              <h2 className="font-semibold text-red-800 mb-2">Error Details:</h2>
              <pre className="text-sm text-red-700 whitespace-pre-wrap break-words">
                {this.state.error?.toString()}
              </pre>
              {this.state.errorInfo && (
                <details className="mt-4 text-xs text-gray-600">
                  <summary>Error Stack Trace</summary>
                  <pre className="whitespace-pre-wrap break-words">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}
            </div>
            <div className="mt-4 flex justify-center">
              <button 
                onClick={() => window.location.reload()}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

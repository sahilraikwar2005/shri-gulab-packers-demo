import React, { Component } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export function InlineLoader({ label = 'Loading...' }) {
  return (
    <span className="inline-loader" role="status" aria-live="polite">
      <span className="ui-spinner" aria-hidden="true" />
      {label}
    </span>
  );
}

export function PageLoader({ label = 'Loading...' }) {
  return (
    <main className="page-loader">
      <InlineLoader label={label} />
    </main>
  );
}

export function ButtonLoader({ label = 'Saving...' }) {
  return (
    <span className="inline-flex items-center justify-center gap-2">
      <span className="ui-spinner ui-spinner-light" aria-hidden="true" />
      {label}
    </span>
  );
}

export function SkeletonCard() {
  return (
    <div className="skeleton-card" aria-hidden="true">
      <span className="skeleton-block skeleton-heading" />
      <span className="skeleton-block skeleton-stat" />
    </div>
  );
}

export function SkeletonGrid({ count = 4, columns = 4 }) {
  return (
    <div className="skeleton-grid" style={{ '--skeleton-columns': columns }} aria-label="Loading content">
      {Array.from({ length: count }, (_, index) => <SkeletonCard key={index} />)}
    </div>
  );
}

export function TableSkeleton({ rows = 5, columns = 4 }) {
  return (
    <div className="table-skeleton" role="status" aria-label="Loading table">
      {Array.from({ length: rows }, (_, row) => (
        <div className="table-skeleton-row" key={row} style={{ '--skeleton-columns': columns }}>
          {Array.from({ length: columns }, (_, col) => <span className="skeleton-block" key={col} />)}
        </div>
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="dashboard-skeleton" role="status" aria-label="Loading dashboard">
      <SkeletonGrid count={4} columns={4} />
      <div className="skeleton-table-panel"><TableSkeleton rows={5} columns={4} /></div>
    </div>
  );
}

export function EmptyState({ message = 'No records found.' }) {
  return <div className="admin-empty-state">{message}</div>;
}

export function ErrorState({ message = 'Something went wrong', onRetry }) {
  return (
    <div className="admin-error-state" role="alert">
      <AlertCircle aria-hidden="true" />
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="error-retry" onClick={() => onRetry()}>
          <RefreshCw aria-hidden="true" />
          Try again
        </button>
      )}
    </div>
  );
}

export class AppErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Unhandled admin render error', error.name, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="admin-error-page">
          <ErrorState
            message="The admin page could not be displayed."
            onRetry={() => this.setState({ hasError: false })}
          />
        </main>
      );
    }
    return this.props.children;
  }
}

import type { ReactNode } from 'react';
import { CircleAlert as AlertCircle } from 'lucide-react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
      {icon && (
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cream-100 text-plum-300">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-plum-600">{title}</h3>
      {description && <p className="max-w-xs text-sm text-plum-400">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export function ErrorState({ message, onRetry, retryLabel }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blush-100 text-coral-400">
        <AlertCircle size={24} />
      </div>
      <p className="text-sm text-plum-500">{message || 'Something went wrong'}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-ghost text-coral-500">
          {retryLabel || 'Try again'}
        </button>
      )}
    </div>
  );
}

interface LoadingProps {
  label?: string;
}

export function Loading({ label }: LoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-cream-200 border-t-coral-400" />
      {label && <p className="text-sm text-plum-400">{label}</p>}
    </div>
  );
}

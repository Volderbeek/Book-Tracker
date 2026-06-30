import { CheckCircle, X, Database } from 'lucide-react';
import type { Toast } from '../types';

interface ToastListProps {
  toasts: Toast[];
}

export function ToastList({ toasts }: ToastListProps) {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast ${toast.type}`}>
          {toast.type === 'success' && <CheckCircle size={18} />}
          {toast.type === 'error' && <X size={18} />}
          {toast.type === 'info' && <Database size={18} />}
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}

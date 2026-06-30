import { Database, AlertTriangle, ArrowRight } from 'lucide-react';

interface DbOfflineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DbOfflineModal({ isOpen, onClose }: DbOfflineModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{ zIndex: 2000 }}>
      <div className="modal-content glass-card animate-slide-up" style={{ maxWidth: '460px', padding: '32px', textAlign: 'center' }}>
        
        {/* Warning Icon Container */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '2px solid rgba(239, 68, 68, 0.3)',
          marginBottom: '24px',
          position: 'relative'
        }}>
          <Database size={32} color="var(--accent-pink)" />
          <AlertTriangle size={18} color="#ef4444" style={{
            position: 'absolute',
            bottom: '2px',
            right: '2px',
            background: 'var(--bg-card)',
            borderRadius: '50%',
            padding: '1px'
          }} />
        </div>

        <h2 style={{
          fontSize: '22px',
          fontWeight: 700,
          color: '#fff',
          marginBottom: '12px',
          letterSpacing: '-0.5px'
        }}>
          Database Offline
        </h2>

        <p style={{
          fontSize: '14px',
          lineHeight: '1.6',
          color: 'var(--text-muted)',
          marginBottom: '24px'
        }}>
          We are sincerely sorry, but our cloud database is currently unreachable. 
          To protect your data session, we have automatically logged you out and reverted your application back to <strong>offline local mode</strong>.
        </p>

        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: '8px',
          padding: '12px 16px',
          textAlign: 'left',
          fontSize: '13px',
          color: 'var(--text-muted)',
          marginBottom: '28px',
          lineHeight: '1.4'
        }}>
          💡 <strong>What happens now?</strong>
          <ul style={{ margin: '6px 0 0 16px', padding: 0 }}>
            <li>You can still track books using your local browser storage.</li>
            <li>All your local updates will remain saved on this device.</li>
            <li>When the database is back online, you can sign in again to sync with your cloud library.</li>
          </ul>
        </div>

        <button
          onClick={onClose}
          className="btn-primary"
          style={{
            width: '100%',
            padding: '12px',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: 600,
            gap: '8px'
          }}
        >
          <span>Continue in Offline Mode</span>
          <ArrowRight size={16} />
        </button>

      </div>
    </div>
  );
}

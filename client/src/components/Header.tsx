import { BookOpen, Database, Moon, Sun, Plus, LogIn, LogOut, Cloud } from 'lucide-react';
import type { User } from '../types';

interface HeaderProps {
  isLightMode: boolean;
  user: User | null;
  onToggleTheme: () => void;
  onAuthClick: () => void;
  onSignOut: () => void;
  onAddBookClick: () => void;
}

export function Header({
  isLightMode,
  user,
  onToggleTheme,
  onAuthClick,
  onSignOut,
  onAddBookClick,
}: HeaderProps) {
  return (
    <header className="app-header">
      <div className="brand">
        <BookOpen className="brand-icon" size={32} />
        <h1 className="brand-name">Ohara Library</h1>
      </div>
      <div className="header-actions" style={{ gap: '12px' }}>
        {user ? (
          <>
            {/* Cloud Sync active badge */}
            <div 
              className="btn-secondary" 
              style={{ 
                fontSize: '12px', 
                padding: '6px 12px', 
                gap: '6px',
                borderColor: 'var(--accent-cyan)',
                cursor: 'default',
                background: 'rgba(6, 182, 212, 0.05)'
              }}
              title="Synchronized to cloud database"
            >
              <Cloud size={14} color="var(--accent-cyan)" />
              <span style={{ color: 'var(--accent-cyan)' }}>Cloud Active</span>
            </div>

            {/* User display */}
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'none', WebkitLineClamp: 1, overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px' }} className="user-email-display">
              {user.email}
            </span>

            {/* Sign Out Button */}
            <button 
              className="btn-secondary" 
              onClick={onSignOut} 
              style={{ gap: '6px', padding: '6px 12px', fontSize: '13px' }}
              title={`Logged in as ${user.email}`}
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </>
        ) : (
          <>
            {/* Local Storage status badge */}
            <div 
              className="btn-secondary" 
              style={{ 
                fontSize: '12px', 
                padding: '6px 12px', 
                gap: '6px',
                borderColor: 'var(--accent-pink)',
                cursor: 'default',
                background: 'rgba(236, 72, 153, 0.05)'
              }}
              title="Data stored strictly in local browser storage"
            >
              <Database size={14} color="var(--accent-pink)" />
              <span style={{ color: 'var(--accent-pink)' }}>Local Offline</span>
            </div>

            {/* Sign In Button */}
            <button 
              className="btn-primary" 
              onClick={onAuthClick} 
              style={{ gap: '6px', padding: '6px 12px', fontSize: '13px' }}
            >
              <LogIn size={14} />
              <span>Sign In</span>
            </button>
          </>
        )}

        <button className="theme-toggle" onClick={onToggleTheme} aria-label="Toggle theme">
          {isLightMode ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        
        <button className="btn-primary" onClick={onAddBookClick}>
          <Plus size={20} />
          <span>Add Book</span>
        </button>
      </div>
    </header>
  );
}


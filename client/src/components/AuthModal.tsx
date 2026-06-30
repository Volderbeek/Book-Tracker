import React, { useState } from 'react';
import { X, Mail, Lock, AlertCircle, Loader } from 'lucide-react';
import type { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (token: string, user: User) => void;
  addToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export function AuthModal({ isOpen, onClose, onAuthSuccess, addToast }: AuthModalProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (isRegister && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      onAuthSuccess(data.token, data.user);
      addToast(isRegister ? 'Account created successfully!' : 'Signed in successfully!', 'success');
      onClose();
    } catch (err: any) {
      if (err.message && err.message.includes('Failed to fetch')) {
        setError('Could not reach the server database. Please verify your connection.');
      } else {
        setError(err.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: 'google' | 'apple') => {
    setError('');
    setLoading(true);
    try {
      const response = await fetch('/api/auth/oauth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'OAuth authentication failed');
      }

      onAuthSuccess(data.token, data.user);
      addToast(`Connected with ${provider.charAt(0).toUpperCase() + provider.slice(1)}! (Demo mode)`, 'success');
      onClose();
    } catch (err: any) {
      if (err.message && err.message.includes('Failed to fetch')) {
        setError('Could not reach the server database. Please verify your connection.');
      } else {
        setError(err.message || 'Something went wrong with social login.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-card animate-slide-up" style={{ maxWidth: '440px' }}>
        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <div className="modal-header" style={{ marginBottom: '24px', textAlign: 'center' }}>
          <h2 className="modal-title" style={{ fontSize: '24px', background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-pink))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 800 }}>
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="modal-subtitle" style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '6px' }}>
            {isRegister ? 'Register to sync your books to the cloud' : 'Sign in to access your cloud library'}
          </p>
        </div>

        {/* Tab switcher */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '4px', marginBottom: '20px' }}>
          <button 
            type="button"
            onClick={() => { setIsRegister(false); setError(''); }}
            style={{ 
              flex: 1, 
              padding: '8px', 
              background: !isRegister ? 'rgba(255,255,255,0.1)' : 'transparent', 
              border: 'none', 
              borderRadius: '6px', 
              color: !isRegister ? '#fff' : 'var(--text-muted)',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Sign In
          </button>
          <button 
            type="button"
            onClick={() => { setIsRegister(true); setError(''); }}
            style={{ 
              flex: 1, 
              padding: '8px', 
              background: isRegister ? 'rgba(255,255,255,0.1)' : 'transparent', 
              border: 'none', 
              borderRadius: '6px', 
              color: isRegister ? '#fff' : 'var(--text-muted)',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Register
          </button>
        </div>

        {error && (
          <div style={{ display: 'flex', gap: '8px', padding: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', color: '#ef4444', fontSize: '13px', marginBottom: '16px', alignItems: 'center' }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com" 
                required 
                style={{ width: '100%', padding: '10px 12px 10px 38px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '14px' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                required 
                style={{ width: '100%', padding: '10px 12px 10px 38px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '14px' }}
              />
            </div>
          </div>

          {isRegister && (
            <div className="form-group">
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••" 
                  required 
                  style={{ width: '100%', padding: '10px 12px 10px 38px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '14px' }}
                />
              </div>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary" 
            style={{ width: '100%', padding: '12px', justifyContent: 'center', fontWeight: '600', marginTop: '8px' }}
          >
            {loading ? (
              <>
                <Loader size={18} className="animate-spin" />
                <span>Please wait...</span>
              </>
            ) : (
              <span>{isRegister ? 'Create Account' : 'Sign In'}</span>
            )}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', color: 'var(--text-muted)', fontSize: '12px' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
          <span style={{ padding: '0 10px' }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
        </div>

        {/* OAuth Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Google Button */}
          <button
            type="button"
            onClick={() => handleOAuth('google')}
            disabled={loading}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              width: '100%',
              padding: '10px',
              background: '#fff',
              border: 'none',
              borderRadius: '8px',
              color: '#111',
              fontWeight: 500,
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'opacity 0.2s'
            }}
            onMouseOver={(e) => (e.currentTarget.style.opacity = '0.9')}
            onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M17.64 9.2c0-.63-.06-1.25-.16-1.84H9v3.47h4.84c-.21 1.12-.84 2.07-1.79 2.7v2.24h2.9c1.69-1.55 2.69-3.85 2.69-6.57z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.23l-2.9-2.24c-.8.54-1.84.87-3.06.87-2.35 0-4.34-1.58-5.05-3.71H.95v2.3A9 9 0 0 0 9 18z"/>
              <path fill="#FBBC05" d="M3.95 10.7a5.4 5.4 0 0 1 0-3.4V5H.95a9 9 0 0 0 0 8l3-2.3z"/>
              <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35L15 2A9 9 0 0 0 .95 5l3 2.3C4.66 5.17 6.65 3.58 9 3.58z"/>
            </svg>
            Continue with Google
          </button>

          {/* Apple Button */}
          <button
            type="button"
            onClick={() => handleOAuth('apple')}
            disabled={loading}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              width: '100%',
              padding: '10px',
              background: '#000',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '8px',
              color: '#fff',
              fontWeight: 500,
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'opacity 0.2s'
            }}
            onMouseOver={(e) => (e.currentTarget.style.opacity = '0.9')}
            onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="#fff">
              <path d="M15.56 9.47c-.03-2.18 1.8-3.22 1.88-3.27-1.02-1.49-2.6-1.69-3.16-1.74-1.34-.14-2.62.79-3.3.79-.68 0-1.74-.77-2.86-.75-1.47.02-2.83.86-3.59 2.17-1.53 2.66-.39 6.6 1.09 8.74.72 1.05 1.58 2.22 2.72 2.18 1.1-.04 1.52-.71 2.78-.71 1.25 0 1.64.71 2.78.69 1.16-.02 1.91-1.05 2.62-2.1.83-1.21 1.17-2.39 1.19-2.45-.03-.01-2.28-.87-2.3-3.49zM12.98 2.82c.6-1.12 1.4-1.89 1.37-3.38-1.27.05-2.81.85-3.72 1.91-.81.94-1.52 1.73-1.33 3.22 1.41.11 2.85-.71 3.68-1.75z"/>
            </svg>
            Continue with Apple
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
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

  const [googleClientId, setGoogleClientId] = useState<string>('');

  useEffect(() => {
    // Fetch public OAuth configurations
    fetch('/api/auth/config')
      .then((res) => res.json())
      .then((data) => {
        if (data.googleClientId) {
          setGoogleClientId(data.googleClientId);
        }
      })
      .catch((err) => console.error('Failed to load Google OAuth configuration:', err));
  }, []);

  const handleCredentialResponse = async (response: any) => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/oauth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: 'google', token: response.credential }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Google OAuth failed');
      }

      onAuthSuccess(data.token, data.user);
      addToast('Successfully signed in with Google!', 'success');
      onClose();
    } catch (err: any) {
      if (err.message && err.message.includes('Failed to fetch')) {
        setError('Could not reach the server database. Please verify your connection.');
      } else {
        setError(err.message || 'Something went wrong with Google Sign-In.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen || !googleClientId) return;

    const checkAndInitGoogle = () => {
      const google = (window as any).google;
      if (google && google.accounts && google.accounts.id) {
        try {
          google.accounts.id.initialize({
            client_id: googleClientId,
            callback: handleCredentialResponse,
            auto_select: false,
          });

          const buttonElement = document.getElementById('google-signin-button');
          if (buttonElement) {
            google.accounts.id.renderButton(buttonElement, {
              theme: 'outline',
              size: 'large',
              width: 392,
              text: 'signin_with',
              shape: 'rectangular',
            });
          }
        } catch (err) {
          console.error('Error rendering Google button:', err);
        }
      } else {
        setTimeout(checkAndInitGoogle, 100);
      }
    };

    checkAndInitGoogle();
  }, [isOpen, googleClientId]);

  if (!isOpen) return null;

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

        {/* Google OAuth Button Container */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
          <div 
            id="google-signin-button" 
            style={{ 
              width: '100%', 
              minHeight: '44px',
              display: 'flex',
              justifyContent: 'center'
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}

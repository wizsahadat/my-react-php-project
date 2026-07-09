import React, { useState } from 'react';

const PHP_AUTH = 'http://localhost/medicare-backend/api/auth.php';

interface AdminLoginPageProps {
  onLoginSuccess: (name: string) => void;
}

const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLoginSuccess }) => {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const handleLogin = async () => {
    setError('');
    if (!email || !password) { setError('Email ও Password দিন।'); return; }
    setLoading(true);

    try {
      const body = new URLSearchParams();
      body.append('email', email);
      body.append('password', password);

      const res  = await fetch(`${PHP_AUTH}?action=login`, {
        method: 'POST', body,
        credentials: 'include',
        headers: { 'Accept': 'application/json' }
      });
      const data = await res.json();

      if (data.success && data.role === 'admin') {
        onLoginSuccess(data.name);
      } else if (data.success && data.role !== 'admin') {
        setError('⛔ আপনি Admin নন। Admin account দিয়ে login করুন।');
      } else {
        setError(data.msg || 'Email বা Password ভুল।');
      }
    } catch {
      setError('⚠️ Server connection error। XAMPP চালু আছে কিনা দেখুন।');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #071a10 0%, #0a2e1e 50%, #0d4a32 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem', fontFamily: 'DM Sans, sans-serif',
      position: 'relative', overflow: 'hidden'
    }}>
      {/* Background circles */}
      {[200, 350, 500].map((size, i) => (
        <div key={i} style={{
          position: 'absolute', borderRadius: '50%',
          border: '1px solid rgba(13,159,110,0.1)',
          width: size, height: size,
          top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          pointerEvents: 'none'
        }} />
      ))}

      {/* Card */}
      <div style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(13,159,110,0.2)',
        borderRadius: 24, padding: '2.5rem',
        width: '100%', maxWidth: 420,
        backdropFilter: 'blur(20px)',
        boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
        position: 'relative', zIndex: 1
      }}>
        {/* Icon */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            width: 64, height: 64, borderRadius: 20,
            background: 'linear-gradient(135deg, #0d9f6e, #076b49)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 30, boxShadow: '0 8px 24px rgba(13,159,110,0.4)',
            marginBottom: '1rem'
          }}>🌿</div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, color: '#fff', fontSize: '1.4rem' }}>
            MediCare
          </div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', letterSpacing: '0.15em', marginTop: 2 }}>
            ADMIN PANEL
          </div>
        </div>

        <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, color: '#fff', fontSize: '1.1rem', marginBottom: '0.4rem', textAlign: 'center' }}>
          Admin Login
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem', textAlign: 'center', marginBottom: '1.5rem' }}>
          শুধুমাত্র Authorized Admin প্রবেশ করতে পারবেন
        </p>

        {/* Error */}
        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: 10, padding: '10px 14px', marginBottom: '1rem',
            color: '#fca5a5', fontSize: '0.83rem'
          }}>
            {error}
          </div>
        )}

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '0.78rem', fontWeight: 600, marginBottom: 6, letterSpacing: '0.05em' }}>
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              autoComplete="off"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="আপনার Email দিন"
              style={{
                width: '100%', boxSizing: 'border-box',
                padding: '12px 14px', borderRadius: 12,
                border: '1.5px solid rgba(13,159,110,0.25)',
                background: 'rgba(255,255,255,0.06)',
                color: '#fff', fontFamily: 'DM Sans,sans-serif', fontSize: '0.9rem',
                outline: 'none', transition: 'border-color 0.2s'
              }}
              onFocus={e => { e.target.style.borderColor = '#0d9f6e'; e.target.style.background = 'rgba(255,255,255,0.09)'; }}
              onBlur={e  => { e.target.style.borderColor = 'rgba(13,159,110,0.25)'; e.target.style.background = 'rgba(255,255,255,0.06)'; }}
            />
          </div>
          <div>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '0.78rem', fontWeight: 600, marginBottom: 6, letterSpacing: '0.05em' }}>
              PASSWORD
            </label>
            <input
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              placeholder="••••••••"
              style={{
                width: '100%', boxSizing: 'border-box',
                padding: '12px 14px', borderRadius: 12,
                border: '1.5px solid rgba(13,159,110,0.25)',
                background: 'rgba(255,255,255,0.06)',
                color: '#fff', fontFamily: 'DM Sans,sans-serif', fontSize: '0.9rem',
                outline: 'none', transition: 'border-color 0.2s'
              }}
              onFocus={e => { e.target.style.borderColor = '#0d9f6e'; e.target.style.background = 'rgba(255,255,255,0.09)'; }}
              onBlur={e  => { e.target.style.borderColor = 'rgba(13,159,110,0.25)'; e.target.style.background = 'rgba(255,255,255,0.06)'; }}
            />
          </div>
        </div>

        <button
          onClick={handleLogin} disabled={loading}
          style={{
            width: '100%', marginTop: '1.25rem',
            padding: '13px',
            background: loading ? 'rgba(13,159,110,0.4)' : 'linear-gradient(135deg, #0d9f6e, #076b49)',
            border: 'none', borderRadius: 12, cursor: loading ? 'wait' : 'pointer',
            fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '0.95rem', color: '#fff',
            boxShadow: loading ? 'none' : '0 6px 20px rgba(13,159,110,0.4)',
            transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
          }}
          onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}
        >
          {loading ? '⏳ Verifying...' : '🔐 Admin Panel এ প্রবেশ করুন'}
        </button>

        {/* Back link */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <a href="/" style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={e => { (e.target as HTMLElement).style.color = '#4ade80'; }}
            onMouseLeave={e => { (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.35)'; }}
          >
            ← মূল সাইটে ফিরুন
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;

import React, { useState } from 'react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: (user: { name: string; email: string; role?: string }) => void;
}

const PHP_AUTH = 'http://localhost/medicare-backend/api/auth.php';

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [tab, setTab]       = useState<'login' | 'register'>('login');
  const [form, setForm]     = useState({ name: '', email: '', phone: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setError(''); setSuccess('');
    if (!form.email || !form.password) { setError('Email ও Password দিন।'); return; }
    if (tab === 'register' && !form.name) { setError('নাম দিন।'); return; }
    setLoading(true);
    try {
      const body = new URLSearchParams();
      body.append('email', form.email);
      body.append('password', form.password);
      if (tab === 'register') {
        body.append('name', form.name);
        body.append('phone', form.phone);
      }
      const res  = await fetch(`${PHP_AUTH}?action=${tab}`, {
        method: 'POST', body,
        credentials: 'include',
        headers: { 'Accept': 'application/json' }
      });
      const data = await res.json();
      if (data.success) {
        // admin হলে user-facing site এ ঢুকতে দেওয়া হবে না
        if (data.role === 'admin') {
          setError('⛔ Admin account দিয়ে এখানে login করা যাবে না। localhost:3000/admin ব্যবহার করুন।');
          setLoading(false);
          return;
        }
        const userName = data.name || form.name || form.email.split('@')[0];
        setSuccess(`✅ ${tab === 'login' ? 'Login' : 'Register'} সফল! স্বাগতম ${userName}!`);
        onLoginSuccess?.({ name: userName, email: form.email, role: data.role });
        setTimeout(() => { onClose(); setSuccess(''); }, 1200);
      } else {
        setError(data.msg || 'Email বা Password ভুল।');
      }
    } catch {
      setError('⚠️ Server connection error। XAMPP চালু আছে কিনা দেখুন।');
    }
    setLoading(false);
  };

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 9500,
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: '#fff', borderRadius: 24, width: '100%', maxWidth: 820,
        overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.25)',
        display: 'grid', gridTemplateColumns: '1fr 1fr'
      }}>

        {/* Left green panel */}
        <div style={{
          background: 'linear-gradient(160deg, #0a2e1e 0%, #0d9f6e 100%)',
          padding: '3rem 2rem', display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center', textAlign: 'center',
          position: 'relative', overflow: 'hidden'
        }}>
          {[0,1,2].map(i => (
            <div key={i} style={{
              position: 'absolute', borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.08)',
              width: `${160 + i*90}px`, height: `${160 + i*90}px`,
              top: '50%', left: '50%', transform: 'translate(-50%,-50%)'
            }} />
          ))}
          <div style={{ fontSize: 52, marginBottom: '1rem', position: 'relative' }}>🌿</div>
          <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1.5rem', color: '#fff', marginBottom: '0.75rem', position: 'relative' }}>
            MediCare Pharmacy
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.83rem', lineHeight: 1.7, position: 'relative' }}>
            Login করুন — order দিন, prescription upload করুন, order track করুন।
          </p>
          <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: 8, position: 'relative' }}>
            {['✅ Genuine medicines', '🚚 Fast home delivery', '🕐 24/7 service'].map(f => (
              <div key={f} style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)' }}>{f}</div>
            ))}
          </div>
        </div>

        {/* Right form panel */}
        <div style={{ padding: '2.5rem' }}>
          <button onClick={onClose} style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: '#aaa' }}>×</button>
          <div style={{ clear: 'both' }} />

          <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1.5rem', color: '#0d1117', marginBottom: 4 }}>
            {tab === 'login' ? 'Welcome Back!' : 'নতুন Account'}
          </h2>
          <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            {tab === 'login' ? 'আপনার account-এ login করুন' : 'নতুন account তৈরি করুন'}
          </p>

          {/* Tabs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: '#f3f4f6', borderRadius: 12, padding: 4, marginBottom: '1.25rem' }}>
            {(['login', 'register'] as const).map(t => (
              <button key={t} onClick={() => { setTab(t); setError(''); setSuccess(''); }} style={{
                padding: '9px', borderRadius: 9, border: 'none', cursor: 'pointer',
                fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '0.88rem',
                background: tab === t ? '#fff' : 'transparent',
                color: tab === t ? '#0d9f6e' : '#888',
                boxShadow: tab === t ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.2s'
              }}>{t === 'login' ? 'Login' : 'Register'}</button>
            ))}
          </div>

          {error && (
            <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 10, padding: '10px 14px', marginBottom: '1rem', color: '#dc2626', fontSize: '0.85rem' }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{ background: '#d1fae5', border: '1px solid #6ee7b7', borderRadius: 10, padding: '10px 14px', marginBottom: '1rem', color: '#065f46', fontSize: '0.85rem' }}>
              {success}
            </div>
          )}

          {/* Form fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {tab === 'register' && (
              <input
                placeholder="আপনার নাম"
                autoComplete="off"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                style={iStyle}
              />
            )}
            <input
              placeholder="Email Address"
              type="email"
              autoComplete="off"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              style={iStyle}
            />
            {tab === 'register' && (
              <input
                placeholder="Phone Number (01XXXXXXXXX)"
                autoComplete="off"
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                style={iStyle}
              />
            )}
            <input
              placeholder="Password"
              type="password"
              autoComplete="new-password"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              style={iStyle}
            />
          </div>

          <button onClick={handleSubmit} disabled={loading} style={{
            width: '100%', padding: '13px', marginTop: '1rem',
            background: loading ? '#9ca3af' : 'linear-gradient(135deg, #0d9f6e, #076b49)',
            border: 'none', borderRadius: 12, cursor: loading ? 'wait' : 'pointer',
            fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '0.95rem', color: '#fff',
            boxShadow: '0 6px 20px rgba(13,159,110,0.3)', transition: 'all 0.2s'
          }}>
            {loading ? '⏳ অপেক্ষা করুন...' : tab === 'login' ? '→ Login করুন' : '→ Account তৈরি করুন'}
          </button>
        </div>
      </div>
    </div>
  );
};

const iStyle: React.CSSProperties = {
  padding: '11px 14px', border: '2px solid #e5e7eb', borderRadius: 11,
  fontFamily: 'DM Sans,sans-serif', fontSize: '0.88rem', color: '#0d1117',
  outline: 'none', width: '100%', boxSizing: 'border-box', background: '#fafafa'
};

export default LoginModal;

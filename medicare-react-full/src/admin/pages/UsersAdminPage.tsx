import React, { useEffect, useState } from 'react';
import { adminUsers, adminDeleteUser } from '../../data/api';

const UsersAdminPage: React.FC = () => {
  const [users, setUsers]           = useState<any[]>([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal]           = useState(0);
  const [msg, setMsg]               = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const data = await adminUsers(page, search);
      setUsers(data.users || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { const t = setTimeout(load, 300); return () => clearTimeout(t); }, [page, search]);

  const deleteUser = async (id: number, name: string) => {
    if (!window.confirm(`"${name}" কে delete করবেন?`)) return;
    const res = await adminDeleteUser(id);
    if (res.success) { setMsg('✅ User deleted!'); load(); setTimeout(() => setMsg(''), 2000); }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.8rem', color: '#0d1117', marginBottom: 4 }}>👥 Users</h1>
          <p style={{ color: '#888' }}>{total} registered users</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {msg && <span style={{ background: '#d1fae5', color: '#065f46', padding: '6px 14px', borderRadius: 8, fontSize: '0.85rem', fontWeight: 600 }}>{msg}</span>}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '2px solid rgba(13,159,110,0.2)', borderRadius: 12, padding: '8px 14px' }}>
            <span>🔍</span>
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="নাম বা email খুঁজুন..."
              style={{ border: 'none', outline: 'none', fontFamily: 'DM Sans, sans-serif', fontSize: '0.88rem', width: 200 }} />
          </div>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e5e7eb' }}>
              {['#', 'Name', 'Email', 'Phone', 'Role', 'Joined', 'Actions'].map(h => (
                <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.78rem', color: '#888', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>⏳ Loading...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>কোনো user নেই</td></tr>
            ) : users.map(u => (
              <tr key={u.user_id} style={{ borderBottom: '1px solid #f0f0f0' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}
              >
                <td style={{ padding: '12px 16px', color: '#888', fontSize: '0.82rem' }}>#{u.user_id}</td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: '50%', background: u.role === 'admin' ? 'linear-gradient(135deg,#0d9f6e,#076b49)' : '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: u.role === 'admin' ? '#fff' : '#0d9f6e', fontWeight: 700, flexShrink: 0 }}>
                      {u.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '0.88rem', color: '#0d1117' }}>{u.name}</span>
                  </div>
                </td>
                <td style={{ padding: '12px 16px', color: '#666', fontSize: '0.82rem' }}>{u.email}</td>
                <td style={{ padding: '12px 16px', color: '#666', fontSize: '0.82rem' }}>{u.phone || '-'}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ background: u.role === 'admin' ? 'linear-gradient(135deg,#0d9f6e,#076b49)' : '#f3f4f6', color: u.role === 'admin' ? '#fff' : '#666', borderRadius: 8, padding: '4px 10px', fontSize: '0.72rem', fontWeight: 700, textTransform: 'capitalize' }}>{u.role}</span>
                </td>
                <td style={{ padding: '12px 16px', color: '#888', fontSize: '0.78rem' }}>{new Date(u.created_at).toLocaleDateString('bn-BD')}</td>
                <td style={{ padding: '12px 16px' }}>
                  {u.role !== 'admin' ? (
                    <button onClick={() => deleteUser(u.user_id, u.name)} style={{ padding: '5px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', background: '#fee2e2', color: '#ef4444', fontWeight: 700, fontSize: '0.78rem' }}>🗑️ Delete</button>
                  ) : (
                    <span style={{ fontSize: '0.75rem', color: '#aaa' }}>Protected</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, padding: '1rem', borderTop: '1px solid #f0f0f0' }}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)} style={{ width: 36, height: 36, borderRadius: 8, border: 'none', cursor: 'pointer', background: p === page ? '#0d9f6e' : '#f3f4f6', color: p === page ? '#fff' : '#555', fontFamily: 'Syne, sans-serif', fontWeight: 700 }}>{p}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersAdminPage;

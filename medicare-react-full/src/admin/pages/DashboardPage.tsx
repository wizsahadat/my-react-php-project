import React, { useEffect, useState } from 'react';
import { adminStats } from '../../data/api';

const statusColor: Record<string, string> = {
  pending: '#f59e0b', processing: '#3b82f6',
  shipped: '#8b5cf6', delivered: '#10b981', cancelled: '#ef4444'
};

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminStats().then(d => { setStats(d.stats); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: 12 }}>
      <div style={{ fontSize: 40 }}>⏳</div>
      <p style={{ color: '#888' }}>Loading dashboard...</p>
    </div>
  );

  const statCards = [
    { label: 'Total Medicines', value: stats?.total_medicines || 0, icon: '💊', color: '#0d9f6e', bg: '#d1fae5' },
    { label: 'Total Orders', value: stats?.total_orders || 0, icon: '📦', color: '#3b82f6', bg: '#dbeafe' },
    { label: 'Total Users', value: stats?.total_users || 0, icon: '👥', color: '#8b5cf6', bg: '#ede9fe' },
    { label: 'Total Revenue', value: `৳${Number(stats?.total_revenue || 0).toLocaleString()}`, icon: '💰', color: '#f59e0b', bg: '#fef3c7' },
    { label: 'Pending Orders', value: stats?.pending_orders || 0, icon: '⏳', color: '#f97316', bg: '#ffedd5' },
    { label: 'Low Stock', value: stats?.low_stock || 0, icon: '⚠️', color: '#ef4444', bg: '#fee2e2' },
  ];

  return (
    <div style={{ padding: '2rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.8rem', color: '#0d1117', marginBottom: 4 }}>Dashboard</h1>
        <p style={{ color: '#888' }}>MediCare Pharmacy — সামগ্রিক পরিসংখ্যান</p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        {statCards.map((s, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: 20, padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: `1px solid ${s.bg}`, transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'; }}
          >
            <div style={{ width: 48, height: 48, borderRadius: 14, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: '0.75rem' }}>{s.icon}</div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.6rem', color: s.color, marginBottom: 2 }}>{s.value}</div>
            <div style={{ fontSize: '0.8rem', color: '#888', fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Recent Orders */}
        <div style={{ background: '#fff', borderRadius: 20, padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: '#0d1117', marginBottom: '1.25rem', fontSize: '1rem' }}>📦 Recent Orders</h3>
          {(stats?.recent_orders || []).length === 0 ? (
            <p style={{ color: '#aaa', textAlign: 'center', padding: '2rem' }}>কোনো order নেই</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(stats?.recent_orders || []).map((o: any) => (
                <div key={o.order_id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: '#f8fafc', borderRadius: 12 }}>
                  <div>
                    <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.85rem', color: '#0d1117' }}>#{o.order_id} — {o.name}</div>
                    <div style={{ fontSize: '0.72rem', color: '#888' }}>{o.user_name || 'Guest'} · ৳{Number(o.total).toLocaleString()}</div>
                  </div>
                  <span style={{ background: statusColor[o.status] + '20', color: statusColor[o.status], borderRadius: 8, padding: '3px 10px', fontSize: '0.72rem', fontWeight: 700, textTransform: 'capitalize' }}>{o.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Medicines */}
        <div style={{ background: '#fff', borderRadius: 20, padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: '#0d1117', marginBottom: '1.25rem', fontSize: '1rem' }}>💊 Top Selling Medicines</h3>
          {(stats?.top_medicines || []).length === 0 ? (
            <p style={{ color: '#aaa', textAlign: 'center', padding: '2rem' }}>কোনো data নেই</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {(stats?.top_medicines || []).map((m: any, i: number) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '0.75rem', color: '#0d9f6e', flexShrink: 0 }}>#{i + 1}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '0.85rem', color: '#0d1117', marginBottom: 4 }}>{m.name}</div>
                    <div style={{ height: 6, background: '#f0f0f0', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: 'linear-gradient(90deg, #0d9f6e, #4ade80)', borderRadius: 3, width: `${Math.min(100, (m.sold / ((stats?.top_medicines[0]?.sold || 1))) * 100)}%` }} />
                    </div>
                  </div>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: '#0d9f6e', fontSize: '0.82rem', flexShrink: 0 }}>{m.sold} sold</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

import React, { useState } from 'react';

interface AdminLayoutProps {
  children: React.ReactNode;
  activePage: string;
  onNavigate: (page: string) => void;
  onExitAdmin: () => void;
  adminName?: string;
}

const menuItems = [
  { id: 'dashboard',     label: 'ড্যাশবোর্ড',       labelEn: 'Dashboard',     icon: '📊' },
  { id: 'medicines',     label: 'ওষুধের তালিকা',     labelEn: 'Medicines',     icon: '💊' },
  { id: 'orders',        label: 'অর্ডার',             labelEn: 'Orders',        icon: '📦' },
  { id: 'prescriptions', label: 'প্রেসক্রিপশন',       labelEn: 'Prescriptions', icon: '📋' },
  { id: 'users',         label: 'ব্যবহারকারী',        labelEn: 'Users',         icon: '👥' },
  { id: 'inventory',     label: 'ইনভেন্টরি',          labelEn: 'Inventory',     icon: '🏪' },
  { id: 'sales',         label: 'বিক্রির হিসাব',      labelEn: 'Sales',         icon: '💰' },
  { id: 'delivery',      label: 'ডেলিভারি',           labelEn: 'Delivery',      icon: '🚚' },
  { id: 'services',      label: 'সেবাসমূহ',           labelEn: 'Services',      icon: '⚙️' },
];

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, activePage, onNavigate, onExitAdmin, adminName }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f0f4f8', fontFamily: 'DM Sans, sans-serif' }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width: collapsed ? 72 : 248,
        background: 'linear-gradient(180deg, #071a10 0%, #0a2e1e 60%, #0d3d26 100%)',
        display: 'flex', flexDirection: 'column',
        transition: 'width 0.3s cubic-bezier(.4,0,.2,1)',
        flexShrink: 0, position: 'sticky', top: 0, height: '100vh', overflow: 'hidden',
        boxShadow: '4px 0 24px rgba(0,0,0,0.25)'
      }}>

        {/* Logo */}
        <div style={{
          padding: collapsed ? '1.2rem 0' : '1.3rem 1.1rem',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          display: 'flex', alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          gap: 10, flexShrink: 0
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: 'linear-gradient(135deg,#0d9f6e,#076b49)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, flexShrink: 0,
            boxShadow: '0 4px 12px rgba(13,159,110,0.35)'
          }}>🌿</div>
          {!collapsed && (
            <div>
              <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, color: '#fff', fontSize: '1rem', lineHeight: 1.2 }}>MediCare</div>
              <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.12em', marginTop: 1 }}>ADMIN PANEL</div>
            </div>
          )}
        </div>

        {/* Menu */}
        <nav style={{ flex: 1, padding: '0.85rem 0.7rem', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
          {menuItems.map(item => {
            const isActive = activePage === item.id;
            return (
              <button key={item.id} onClick={() => onNavigate(item.id)}
                title={collapsed ? item.labelEn : ''}
                style={{
                  display: 'flex', alignItems: 'center',
                  gap: collapsed ? 0 : 11,
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  padding: collapsed ? '12px 0' : '10px 13px',
                  borderRadius: 11, border: 'none', cursor: 'pointer',
                  background: isActive ? 'rgba(13,159,110,0.25)' : 'transparent',
                  color: isActive ? '#4ade80' : 'rgba(255,255,255,0.55)',
                  fontFamily: 'Syne,sans-serif', fontWeight: isActive ? 700 : 500,
                  fontSize: '0.84rem',
                  transition: 'all 0.18s',
                  textAlign: 'left', width: '100%',
                  borderLeft: isActive ? '3px solid #4ade80' : '3px solid transparent',
                  position: 'relative'
                }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#fff'; } }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.55)'; } }}
              >
                <span style={{ fontSize: 17, flexShrink: 0, lineHeight: 1 }}>{item.icon}</span>
                {!collapsed && (
                  <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                    <span style={{ fontSize: '0.83rem' }}>{item.label}</span>
                    <span style={{ fontSize: '0.65rem', opacity: 0.5, fontWeight: 400 }}>{item.labelEn}</span>
                  </div>
                )}
              </button>
            );
          })}

          {/* Divider */}
          <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '6px 4px' }} />

          {/* View Site */}
          <button onClick={() => window.open('/', '_blank')}
            title={collapsed ? 'View Site' : ''}
            style={{
              display: 'flex', alignItems: 'center',
              gap: collapsed ? 0 : 11,
              justifyContent: collapsed ? 'center' : 'flex-start',
              padding: collapsed ? '12px 0' : '10px 13px',
              borderRadius: 11, border: '1.5px solid rgba(74,222,128,0.2)',
              cursor: 'pointer',
              background: 'rgba(74,222,128,0.06)',
              color: '#4ade80',
              fontFamily: 'Syne,sans-serif', fontWeight: 600, fontSize: '0.83rem',
              transition: 'all 0.18s', width: '100%',
              borderLeft: '3px solid transparent'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(74,222,128,0.15)'; e.currentTarget.style.borderColor = 'rgba(74,222,128,0.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(74,222,128,0.06)'; e.currentTarget.style.borderColor = 'rgba(74,222,128,0.2)'; }}
          >
            <span style={{ fontSize: 17, flexShrink: 0 }}>🌐</span>
            {!collapsed && (
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                <span style={{ fontSize: '0.83rem' }}>সাইট দেখুন</span>
                <span style={{ fontSize: '0.65rem', opacity: 0.6, fontWeight: 400 }}>View Site ↗</span>
              </div>
            )}
          </button>
        </nav>

        {/* Bottom */}
        <div style={{ padding: '0.85rem 0.7rem', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {/* Admin info */}
          {!collapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 12px', background: 'rgba(255,255,255,0.06)', borderRadius: 11, marginBottom: 2 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#0d9f6e,#076b49)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0 }}>👤</div>
              <div>
                <div style={{ color: '#fff', fontSize: '0.82rem', fontWeight: 700 }}>{adminName || 'Admin'}</div>
                <div style={{ color: '#4ade80', fontSize: '0.65rem', fontWeight: 500 }}>Administrator</div>
              </div>
            </div>
          )}

          {/* Logout */}
          <button onClick={onExitAdmin}
            title={collapsed ? 'Logout' : ''}
            style={{
              display: 'flex', alignItems: 'center',
              justifyContent: collapsed ? 'center' : 'flex-start',
              gap: collapsed ? 0 : 8,
              padding: collapsed ? '11px 0' : '9px 13px',
              borderRadius: 10, border: 'none', cursor: 'pointer',
              background: 'rgba(239,68,68,0.12)', color: '#fca5a5',
              fontFamily: 'Syne,sans-serif', fontWeight: 600, fontSize: '0.82rem',
              transition: 'all 0.18s', width: '100%'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.22)'; e.currentTarget.style.color = '#f87171'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.12)'; e.currentTarget.style.color = '#fca5a5'; }}
          >
            <span style={{ fontSize: 16 }}>🚪</span>
            {!collapsed && ' Logout'}
          </button>

          {/* Collapse toggle */}
          <button onClick={() => setCollapsed(!collapsed)} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '8px', borderRadius: 10, border: 'none', cursor: 'pointer',
            background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)',
            fontSize: 14, transition: 'all 0.2s', width: '100%'
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}
          >
            {collapsed ? '▶' : '◀'}
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main style={{ flex: 1, overflow: 'auto', minHeight: '100vh', background: '#f0f4f8' }}>
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;

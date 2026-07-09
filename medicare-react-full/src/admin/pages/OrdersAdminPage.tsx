import React, { useEffect, useState } from 'react';
import { adminOrders, adminUpdateOrder, adminOrderDetail, fetchDeliveryMen, assignDeliveryMan, updateDeliveryStatus, DeliveryMan } from '../../data/api';

const statusList = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const deliveryStatusList = ['not_assigned', 'assigned', 'picked_up', 'on_the_way', 'delivered', 'failed'];
const deliveryStatusLabel: Record<string, string> = {
  not_assigned: 'অ্যাসাইন হয়নি',
  assigned: 'অ্যাসাইন হয়েছে',
  picked_up: 'পিকআপ হয়েছে',
  on_the_way: 'পথে আছে',
  delivered: 'ডেলিভার্ড',
  failed: 'ব্যর্থ',
};
const deliveryStatusColor: Record<string, { bg: string; text: string }> = {
  not_assigned: { bg: '#f3f4f6', text: '#555' },
  assigned:     { bg: '#dbeafe', text: '#1e40af' },
  picked_up:    { bg: '#fef3c7', text: '#92400e' },
  on_the_way:   { bg: '#ede9fe', text: '#5b21b6' },
  delivered:    { bg: '#d1fae5', text: '#065f46' },
  failed:       { bg: '#fee2e2', text: '#991b1b' },
};
const statusColor: Record<string, { bg: string; text: string }> = {
  pending:    { bg: '#fef3c7', text: '#92400e' },
  processing: { bg: '#dbeafe', text: '#1e40af' },
  shipped:    { bg: '#ede9fe', text: '#5b21b6' },
  delivered:  { bg: '#d1fae5', text: '#065f46' },
  cancelled:  { bg: '#fee2e2', text: '#991b1b' },
};

const OrdersAdminPage: React.FC = () => {
  const [orders, setOrders]         = useState<any[]>([]);
  const [loading, setLoading]       = useState(true);
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal]           = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [detail, setDetail]         = useState<any>(null);
  const [msg, setMsg]               = useState('');
  const [deliveryMen, setDeliveryMen] = useState<DeliveryMan[]>([]);

  const load = async () => {
    setLoading(true);
    try {
      const data = await adminOrders(page, statusFilter);
      setOrders(data.orders || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, [page, statusFilter]);
  useEffect(() => { fetchDeliveryMen().then(setDeliveryMen).catch(() => {}); }, []);

  const updateStatus = async (orderId: number, status: string) => {
    const res = await adminUpdateOrder(orderId, status);
    if (res.success) {
      setMsg('✅ Status updated!');
      load();
      if (detail && detail.order_id === orderId) setDetail({ ...detail, status });
      setTimeout(() => setMsg(''), 2000);
    }
  };

  const handleAssign = async (orderId: number, manId: string) => {
    const res = await assignDeliveryMan(orderId, Number(manId));
    if (res.success) { setMsg('✅ ' + res.msg); load(); }
    setTimeout(() => setMsg(''), 2000);
  };

  const handleDeliveryStatus = async (orderId: number, status: string) => {
    const res = await updateDeliveryStatus(orderId, status);
    if (res.success) { setMsg('✅ ' + res.msg); load(); }
    setTimeout(() => setMsg(''), 2000);
  };

  const viewDetail = async (id: number) => {
    const data = await adminOrderDetail(id);
    if (data.success) setDetail(data.order);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.8rem', color: '#0d1117', marginBottom: 4 }}>📦 Orders</h1>
          <p style={{ color: '#888' }}>{total} total orders</p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {msg && <span style={{ background: '#d1fae5', color: '#065f46', padding: '6px 14px', borderRadius: 8, fontSize: '0.85rem', fontWeight: 600 }}>{msg}</span>}
          <button onClick={() => { setStatusFilter(''); setPage(1); }} style={{ padding: '8px 16px', borderRadius: 10, border: 'none', cursor: 'pointer', background: statusFilter === '' ? '#0d1117' : '#f3f4f6', color: statusFilter === '' ? '#fff' : '#555', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.82rem' }}>All</button>
          {statusList.map(s => (
            <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }} style={{ padding: '8px 16px', borderRadius: 10, border: 'none', cursor: 'pointer', background: statusFilter === s ? statusColor[s].text : statusColor[s].bg, color: statusFilter === s ? '#fff' : statusColor[s].text, fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.82rem', textTransform: 'capitalize' }}>{s}</button>
          ))}
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e5e7eb' }}>
              {['Order #', 'Customer', 'Phone', 'Address', 'Total', 'Status', 'Delivery Man', 'Delivery Status', 'Date', 'Actions'].map(h => (
                <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.78rem', color: '#888', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={10} style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>⏳ Loading...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={10} style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>কোনো order নেই</td></tr>
            ) : orders.map(o => (
              <tr key={o.order_id} style={{ borderBottom: '1px solid #f0f0f0' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}
              >
                <td style={{ padding: '12px 16px', fontFamily: 'Syne, sans-serif', fontWeight: 700, color: '#0d9f6e' }}>#{o.order_id}</td>
                <td style={{ padding: '12px 16px', fontWeight: 600, fontSize: '0.88rem' }}>{o.name}</td>
                <td style={{ padding: '12px 16px', color: '#666', fontSize: '0.82rem' }}>{o.phone}</td>
                <td style={{ padding: '12px 16px', color: '#666', fontSize: '0.82rem', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.address}</td>
                <td style={{ padding: '12px 16px', fontFamily: 'Syne, sans-serif', fontWeight: 700, color: '#0d9f6e' }}>৳{Number(o.total).toLocaleString()}</td>
                <td style={{ padding: '12px 16px' }}>
                  <select value={o.status} onChange={e => updateStatus(o.order_id, e.target.value)}
                    style={{ background: statusColor[o.status]?.bg || '#f3f4f6', color: statusColor[o.status]?.text || '#555', border: 'none', borderRadius: 8, padding: '5px 10px', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', textTransform: 'capitalize' }}>
                    {statusList.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <select value={o.delivery_man_id || ''} onChange={e => handleAssign(o.order_id, e.target.value)}
                    style={{ background: '#f3f4f6', color: '#333', border: 'none', borderRadius: 8, padding: '5px 10px', fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer', minWidth: 120 }}>
                    <option value="">-- Unassigned --</option>
                    {deliveryMen.map(d => <option key={d.delivery_man_id} value={d.delivery_man_id}>{d.name} ({d.phone})</option>)}
                  </select>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <select value={o.delivery_status || 'not_assigned'} onChange={e => handleDeliveryStatus(o.order_id, e.target.value)}
                    style={{ background: deliveryStatusColor[o.delivery_status]?.bg || '#f3f4f6', color: deliveryStatusColor[o.delivery_status]?.text || '#555', border: 'none', borderRadius: 8, padding: '5px 10px', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer' }}>
                    {deliveryStatusList.map(s => <option key={s} value={s}>{deliveryStatusLabel[s]}</option>)}
                  </select>
                </td>
                <td style={{ padding: '12px 16px', color: '#888', fontSize: '0.78rem' }}>{new Date(o.created_at).toLocaleDateString('bn-BD')}</td>
                <td style={{ padding: '12px 16px' }}>
                  <button onClick={() => viewDetail(o.order_id)} style={{ padding: '5px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', background: '#f0fdf4', color: '#0d9f6e', fontWeight: 700, fontSize: '0.78rem' }}>👁️ View</button>
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

      {/* Order Detail Modal */}
      {detail && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9000, padding: '1rem' }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: '2rem', width: '100%', maxWidth: 500, boxShadow: '0 24px 60px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, color: '#0d1117' }}>Order #{detail.order_id}</h3>
              <button onClick={() => setDetail(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: '#aaa' }}>×</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: '1.5rem' }}>
              {[['Customer', detail.name], ['Phone', detail.phone], ['Address', detail.address], ['Status', detail.status], ['Delivery Man', detail.delivery_man_name || 'অ্যাসাইন হয়নি'], ['Delivery Status', deliveryStatusLabel[detail.delivery_status] || deliveryStatusLabel['not_assigned']], ['Total', `৳${Number(detail.total).toLocaleString()}`]].map(([k, v]) => (
                <div key={k as string} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                  <span style={{ color: '#888', fontSize: '0.85rem' }}>{k}</span>
                  <span style={{ fontWeight: 600, fontSize: '0.88rem', color: '#0d1117', textTransform: 'capitalize' }}>{v}</span>
                </div>
              ))}
            </div>
            <h4 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, marginBottom: '0.75rem', color: '#0d1117' }}>Items</h4>
            {(detail.items || []).map((item: any, i: number) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#f8fafc', borderRadius: 10, marginBottom: 6 }}>
                <span style={{ fontSize: '0.85rem', color: '#0d1117' }}>{item.name} × {item.qty}</span>
                <span style={{ fontWeight: 700, color: '#0d9f6e', fontSize: '0.85rem' }}>৳{(item.price * item.qty).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersAdminPage;

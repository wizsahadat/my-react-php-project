import React, { useEffect, useState } from 'react';
import {
  DeliveryMan,
  fetchDeliveryMen,
  addDeliveryMan,
  updateDeliveryMan,
  deleteDeliveryMan,
  deliveryStats,
} from '../../data/api';

const emptyForm = { delivery_man_id: 0, name: '', phone: '', email: '', vehicle: '', area: '', status: 'active' as 'active' | 'inactive' };

const DeliveryAdminPage: React.FC = () => {
  const [men, setMen]         = useState<DeliveryMan[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats]     = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]       = useState(emptyForm);
  const [msg, setMsg]         = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const [list, st] = await Promise.all([fetchDeliveryMen(), deliveryStats()]);
      setMen(list);
      if (st.success) setStats(st.stats);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(emptyForm); setShowForm(true); };
  const openEdit = (d: DeliveryMan) => {
    setForm({ delivery_man_id: d.delivery_man_id, name: d.name, phone: d.phone, email: d.email || '', vehicle: d.vehicle || '', area: d.area || '', status: d.status });
    setShowForm(true);
  };

  const save = async () => {
    if (!form.name.trim() || !form.phone.trim()) { setMsg('❌ নাম ও ফোন আবশ্যক'); setTimeout(() => setMsg(''), 2000); return; }
    const res = form.delivery_man_id
      ? await updateDeliveryMan(form)
      : await addDeliveryMan(form);
    if (res.success) {
      setMsg('✅ ' + res.msg);
      setShowForm(false);
      load();
    } else {
      setMsg('❌ ' + (res.msg || 'Error'));
    }
    setTimeout(() => setMsg(''), 2500);
  };

  const remove = async (id: number) => {
    if (!window.confirm('আপনি কি নিশ্চিত এই ডেলিভারি ম্যান ডিলিট করতে চান?')) return;
    const res = await deleteDeliveryMan(id);
    if (res.success) { setMsg('✅ ' + res.msg); load(); }
    setTimeout(() => setMsg(''), 2000);
  };

  const statCard = (label: string, value: any, color: string) => (
    <div style={{ background: '#fff', borderRadius: 16, padding: '1.1rem 1.3rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', flex: 1, minWidth: 150 }}>
      <div style={{ color: '#888', fontSize: '0.78rem', fontWeight: 600, marginBottom: 6 }}>{label}</div>
      <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.6rem', color }}>{value ?? '-'}</div>
    </div>
  );

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.8rem', color: '#0d1117', marginBottom: 4 }}>🚚 Delivery</h1>
          <p style={{ color: '#888' }}>ডেলিভারি ম্যান ম্যানেজমেন্ট</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {msg && <span style={{ background: '#d1fae5', color: '#065f46', padding: '6px 14px', borderRadius: 8, fontSize: '0.85rem', fontWeight: 600 }}>{msg}</span>}
          <button onClick={openAdd} style={{ padding: '10px 18px', borderRadius: 10, border: 'none', cursor: 'pointer', background: '#0d9f6e', color: '#fff', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.85rem' }}>+ নতুন ডেলিভারি ম্যান</button>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {statCard('মোট ডেলিভারি ম্যান', stats.total_delivery_men, '#0d1117')}
          {statCard('সক্রিয়', stats.active_delivery_men, '#0d9f6e')}
          {statCard('অ্যাসাইন বাকি', stats.not_assigned, '#92400e')}
          {statCard('পথে আছে', stats.out_for_delivery, '#5b21b6')}
          {statCard('মোট ডেলিভার্ড', stats.delivered_total, '#065f46')}
        </div>
      )}

      <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e5e7eb' }}>
              {['নাম', 'ফোন', 'এলাকা', 'বাহন', 'স্ট্যাটাস', 'অ্যাসাইন', 'ডেলিভার্ড', 'অ্যাকশন'].map(h => (
                <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.78rem', color: '#888', letterSpacing: '0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>⏳ Loading...</td></tr>
            ) : men.length === 0 ? (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>কোনো ডেলিভারি ম্যান নেই, নতুন যোগ করুন</td></tr>
            ) : men.map(d => (
              <tr key={d.delivery_man_id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '12px 16px', fontWeight: 700, fontSize: '0.88rem', color: '#0d1117' }}>{d.name}</td>
                <td style={{ padding: '12px 16px', color: '#666', fontSize: '0.82rem' }}>{d.phone}</td>
                <td style={{ padding: '12px 16px', color: '#666', fontSize: '0.82rem' }}>{d.area || '-'}</td>
                <td style={{ padding: '12px 16px', color: '#666', fontSize: '0.82rem' }}>{d.vehicle || '-'}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    padding: '4px 10px', borderRadius: 8, fontSize: '0.75rem', fontWeight: 700,
                    background: d.status === 'active' ? '#d1fae5' : '#fee2e2',
                    color: d.status === 'active' ? '#065f46' : '#991b1b'
                  }}>{d.status === 'active' ? 'সক্রিয়' : 'নিষ্ক্রিয়'}</span>
                </td>
                <td style={{ padding: '12px 16px', fontWeight: 700, color: '#5b21b6' }}>{d.total_assigned ?? 0}</td>
                <td style={{ padding: '12px 16px', fontWeight: 700, color: '#0d9f6e' }}>{d.total_delivered ?? 0}</td>
                <td style={{ padding: '12px 16px', display: 'flex', gap: 6 }}>
                  <button onClick={() => openEdit(d)} style={{ padding: '5px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', background: '#eff6ff', color: '#1e40af', fontWeight: 700, fontSize: '0.78rem' }}>✏️ Edit</button>
                  <button onClick={() => remove(d.delivery_man_id)} style={{ padding: '5px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', background: '#fef2f2', color: '#991b1b', fontWeight: 700, fontSize: '0.78rem' }}>🗑️ Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9000, padding: '1rem' }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: '2rem', width: '100%', maxWidth: 440, boxShadow: '0 24px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, color: '#0d1117' }}>{form.delivery_man_id ? 'এডিট করুন' : 'নতুন ডেলিভারি ম্যান'}</h3>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: '#aaa' }}>×</button>
            </div>

            {[
              { key: 'name', label: 'নাম *' },
              { key: 'phone', label: 'ফোন *' },
              { key: 'email', label: 'ইমেইল' },
              { key: 'vehicle', label: 'বাহন (Bike/Cycle/Van)' },
              { key: 'area', label: 'কভারেজ এলাকা' },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: '0.9rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#555', marginBottom: 4 }}>{f.label}</label>
                <input
                  value={(form as any)[f.key]}
                  onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1.5px solid #e5e7eb', fontSize: '0.88rem', boxSizing: 'border-box' }}
                />
              </div>
            ))}

            {form.delivery_man_id > 0 && (
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#555', marginBottom: 4 }}>স্ট্যাটাস</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as 'active' | 'inactive' })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1.5px solid #e5e7eb', fontSize: '0.88rem' }}>
                  <option value="active">সক্রিয়</option>
                  <option value="inactive">নিষ্ক্রিয়</option>
                </select>
              </div>
            )}

            <button onClick={save} style={{ width: '100%', padding: '12px', borderRadius: 12, border: 'none', cursor: 'pointer', background: '#0d9f6e', color: '#fff', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.9rem' }}>সংরক্ষণ করুন</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryAdminPage;

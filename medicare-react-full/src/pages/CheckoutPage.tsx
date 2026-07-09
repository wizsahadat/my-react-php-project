import React, { useState } from 'react';
import { CartItem, placeOrder } from '../data/api';

interface CheckoutPageProps {
  cart: CartItem[];
  user: { name: string; email: string } | null;
  onOrderSuccess: (orderId: number) => void;
  onBack: () => void;
  onOpenLogin: () => void;
}

const PAYMENT_METHODS = [
  { id: 'cod',   label: 'Cash on Delivery', labelBn: 'ডেলিভারিতে পরিশোধ', icon: '💵', color: '#059669' },
  { id: 'bkash', label: 'bKash',            labelBn: 'মোবাইল পেমেন্ট',    icon: '📱', color: '#e91e8c' },
  { id: 'nagad', label: 'Nagad',            labelBn: 'মোবাইল পেমেন্ট',    icon: '🔴', color: '#f97316' },
];

const CheckoutPage: React.FC<CheckoutPageProps> = ({ cart, user, onOrderSuccess, onBack, onOpenLogin }) => {
  const [form, setForm] = useState({
    name:    user?.name || '',
    phone:   '',
    address: '',
    notes:   '',
    payment: 'cod',
  });
  const [loading,  setLoading]  = useState(false);
  const [errors,   setErrors]   = useState<Record<string,string>>({});
  const [success,  setSuccess]  = useState<{orderId:number;msg:string}|null>(null);

  const total       = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const deliveryFee = total >= 500 ? 0 : 50;
  const grandTotal  = total + deliveryFee;

  const F = (k: string, v: string) => {
    setForm(p => ({...p, [k]: v}));
    setErrors(p => ({...p, [k]: ''}));
  };

  const validate = () => {
    const e: Record<string,string> = {};
    if (!form.name.trim())    e.name    = 'নাম দিন';
    if (!form.phone.trim())   e.phone   = 'মোবাইল নম্বর দিন';
    else if (!/^01[3-9]\d{8}$/.test(form.phone)) e.phone = '01X-XXXXXXXX ফরম্যাটে দিন';
    if (!form.address.trim()) e.address = 'ডেলিভারি ঠিকানা দিন';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!user) { onOpenLogin(); return; }
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await placeOrder({
        name:    form.name,
        phone:   form.phone,
        address: form.address,
        notes:   form.notes,
        payment: form.payment,
        items:   cart,
      });
      if (res.success) {
        setSuccess({ orderId: res.order_id, msg: res.msg });
        onOrderSuccess(res.order_id);
      } else {
        setErrors({ _: res.msg || 'অর্ডার দেওয়া যায়নি। আবার চেষ্টা করুন।' });
      }
    } catch {
      setErrors({ _: '⚠️ Server connection error। আবার চেষ্টা করুন।' });
    }
    setLoading(false);
  };

  const IS = (field: string): React.CSSProperties => ({
    width: '100%', boxSizing: 'border-box',
    padding: '12px 14px', borderRadius: 12,
    border: `2px solid ${errors[field] ? '#fca5a5' : '#e5e7eb'}`,
    fontFamily: 'DM Sans,sans-serif', fontSize: '0.9rem', color: '#0d1117',
    outline: 'none', background: errors[field] ? '#fff5f5' : '#fafafa',
    transition: 'border-color 0.2s'
  });

  // ── SUCCESS STATE ──
  if (success) {
    return (
      <div style={{ minHeight:'80vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem', fontFamily:'DM Sans,sans-serif' }}>
        <div style={{ textAlign:'center', maxWidth:440 }}>
          <div style={{ width:90, height:90, borderRadius:'50%', background:'linear-gradient(135deg,#0d9f6e,#076b49)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:42, margin:'0 auto 1.5rem', boxShadow:'0 12px 32px rgba(13,159,110,0.4)' }}>✅</div>
          <h2 style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:'1.6rem', color:'#0d1117', marginBottom:'0.5rem' }}>অর্ডার সফল!</h2>
          <div style={{ background:'#f0fdf4', border:'1.5px solid #bbf7d0', borderRadius:14, padding:'1rem 1.25rem', marginBottom:'1.5rem' }}>
            <div style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:'1.1rem', color:'#059669' }}>অর্ডার #{success.orderId}</div>
            <div style={{ color:'#555', fontSize:'0.85rem', marginTop:4, lineHeight:1.6 }}>{success.msg}</div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem', marginBottom:'1.5rem' }}>
            {[
              { icon:'🚚', label:'ডেলিভারি', val:'২৪-৪৮ ঘণ্টা' },
              { icon:'📞', label:'যোগাযোগ', val:'শীঘ্রই' },
              { icon:'💳', label:'পেমেন্ট', val: PAYMENT_METHODS.find(p=>p.id===form.payment)?.label || 'COD' },
              { icon:'📦', label:'মোট', val:`৳${grandTotal}` },
            ].map(s=>(
              <div key={s.label} style={{ background:'#f8fafc', borderRadius:12, padding:'0.85rem', textAlign:'center' }}>
                <div style={{ fontSize:22, marginBottom:4 }}>{s.icon}</div>
                <div style={{ fontSize:'0.72rem', color:'#aaa', fontWeight:600 }}>{s.label}</div>
                <div style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'0.88rem', color:'#0d1117', marginTop:2 }}>{s.val}</div>
              </div>
            ))}
          </div>
          <button onClick={onBack}
            style={{ padding:'13px 32px', background:'linear-gradient(135deg,#0d9f6e,#076b49)', color:'#fff', border:'none', borderRadius:14, cursor:'pointer', fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'0.95rem', boxShadow:'0 6px 20px rgba(13,159,110,0.3)' }}>
            🏠 হোমে ফিরুন
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background:'#f7fdf9', minHeight:'100vh', padding:'2rem 1rem', fontFamily:'DM Sans,sans-serif' }}>
      <div style={{ maxWidth:1080, margin:'0 auto' }}>

        {/* Page Header */}
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:'1.75rem' }}>
          <button onClick={onBack}
            style={{ background:'#fff', border:'1.5px solid #e5e7eb', borderRadius:10, padding:'8px 14px', cursor:'pointer', fontFamily:'Syne,sans-serif', fontWeight:600, fontSize:'0.85rem', color:'#555', display:'flex', alignItems:'center', gap:6 }}>
            ← ফিরুন
          </button>
          <div>
            <h1 style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:'1.5rem', color:'#0d1117', margin:0 }}>🧾 Checkout</h1>
            <p style={{ color:'#888', fontSize:'0.82rem', margin:'2px 0 0' }}>অর্ডার সম্পন্ন করুন</p>
          </div>
        </div>

        {/* Login warning */}
        {!user && (
          <div style={{ background:'#fefce8', border:'1.5px solid #fde68a', borderRadius:14, padding:'1rem 1.25rem', marginBottom:'1.5rem', display:'flex', alignItems:'center', gap:12 }}>
            <span style={{ fontSize:24 }}>⚠️</span>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:'Syne,sans-serif', fontWeight:700, color:'#92400e', fontSize:'0.9rem' }}>Login করা নেই</div>
              <div style={{ color:'#78350f', fontSize:'0.82rem', marginTop:2 }}>অর্ডার দিতে হলে আগে login করতে হবে।</div>
            </div>
            <button onClick={onOpenLogin}
              style={{ padding:'8px 18px', background:'#0d9f6e', color:'#fff', border:'none', borderRadius:10, cursor:'pointer', fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'0.83rem', flexShrink:0 }}>
              Login করুন
            </button>
          </div>
        )}

        <div style={{ display:'grid', gridTemplateColumns:'1fr 380px', gap:'1.5rem', alignItems:'flex-start' }}>

          {/* ── LEFT: Form ── */}
          <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>

            {/* Delivery Info */}
            <div style={{ background:'#fff', borderRadius:20, padding:'1.75rem', boxShadow:'0 2px 12px rgba(0,0,0,0.06)' }}>
              <h2 style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:'1.05rem', color:'#0d1117', margin:'0 0 1.25rem', display:'flex', alignItems:'center', gap:8 }}>
                🏠 Delivery Information
              </h2>

              {errors._ && (
                <div style={{ background:'#fee2e2', border:'1px solid #fca5a5', borderRadius:10, padding:'10px 14px', marginBottom:'1rem', color:'#dc2626', fontSize:'0.85rem', fontWeight:600 }}>
                  {errors._}
                </div>
              )}

              <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
                {/* Full Name */}
                <div>
                  <label style={{ display:'block', fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'0.8rem', color:'#374151', marginBottom:6 }}>Full Name *</label>
                  <input value={form.name} onChange={e=>F('name',e.target.value)} placeholder="আপনার পুরো নাম" style={IS('name')}
                    onFocus={e=>{if(!errors.name)e.target.style.borderColor='#0d9f6e';}}
                    onBlur={e=>{if(!errors.name)e.target.style.borderColor='#e5e7eb';}} />
                  {errors.name && <div style={{ color:'#dc2626', fontSize:'0.75rem', marginTop:4 }}>⚠️ {errors.name}</div>}
                </div>

                {/* Phone */}
                <div>
                  <label style={{ display:'block', fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'0.8rem', color:'#374151', marginBottom:6 }}>Phone Number *</label>
                  <input value={form.phone} onChange={e=>F('phone',e.target.value)} placeholder="01XXXXXXXXX" style={IS('phone')} maxLength={11}
                    onFocus={e=>{if(!errors.phone)e.target.style.borderColor='#0d9f6e';}}
                    onBlur={e=>{if(!errors.phone)e.target.style.borderColor='#e5e7eb';}} />
                  {errors.phone && <div style={{ color:'#dc2626', fontSize:'0.75rem', marginTop:4 }}>⚠️ {errors.phone}</div>}
                </div>

                {/* Address */}
                <div>
                  <label style={{ display:'block', fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'0.8rem', color:'#374151', marginBottom:6 }}>Delivery Address *</label>
                  <textarea value={form.address} onChange={e=>F('address',e.target.value)} rows={3}
                    placeholder="সম্পূর্ণ ঠিকানা লিখুন — রাস্তা, এলাকা, জেলা..."
                    style={{...IS('address'), resize:'vertical', lineHeight:1.6}}
                    onFocus={e=>{if(!errors.address)e.target.style.borderColor='#0d9f6e';}}
                    onBlur={e=>{if(!errors.address)e.target.style.borderColor='#e5e7eb';}} />
                  {errors.address && <div style={{ color:'#dc2626', fontSize:'0.75rem', marginTop:4 }}>⚠️ {errors.address}</div>}
                </div>

                {/* Notes */}
                <div>
                  <label style={{ display:'block', fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'0.8rem', color:'#374151', marginBottom:6 }}>
                    Order Notes <span style={{ color:'#aaa', fontWeight:400 }}>(optional)</span>
                  </label>
                  <textarea value={form.notes} onChange={e=>F('notes',e.target.value)} rows={2}
                    placeholder="বিশেষ নির্দেশনা থাকলে লিখুন..."
                    style={{...IS('notes'), resize:'vertical', lineHeight:1.6}}
                    onFocus={e=>{e.target.style.borderColor='#0d9f6e';}}
                    onBlur={e=>{e.target.style.borderColor='#e5e7eb';}} />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div style={{ background:'#fff', borderRadius:20, padding:'1.75rem', boxShadow:'0 2px 12px rgba(0,0,0,0.06)' }}>
              <h2 style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:'1.05rem', color:'#0d1117', margin:'0 0 1.25rem', display:'flex', alignItems:'center', gap:8 }}>
                💳 Payment Method *
              </h2>
              <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
                {PAYMENT_METHODS.map(pm => (
                  <div key={pm.id} onClick={()=>F('payment',pm.id)}
                    style={{ display:'flex', alignItems:'center', gap:14, padding:'1rem 1.25rem', borderRadius:14, cursor:'pointer',
                      border: `2px solid ${form.payment===pm.id ? pm.color : '#e5e7eb'}`,
                      background: form.payment===pm.id ? `${pm.color}10` : '#fafafa',
                      transition:'all 0.2s'
                    }}
                  >
                    <div style={{ width:20, height:20, borderRadius:'50%', border:`2px solid ${pm.color}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      {form.payment===pm.id && <div style={{ width:10, height:10, borderRadius:'50%', background:pm.color }} />}
                    </div>
                    <span style={{ fontSize:24, flexShrink:0 }}>{pm.icon}</span>
                    <div>
                      <div style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'0.92rem', color:'#0d1117' }}>{pm.label}</div>
                      <div style={{ fontSize:'0.75rem', color:'#888' }}>{pm.labelBn}</div>
                    </div>
                    {form.payment===pm.id && <span style={{ marginLeft:'auto', background:pm.color, color:'#fff', borderRadius:20, padding:'3px 10px', fontSize:'0.72rem', fontWeight:700 }}>✓ নির্বাচিত</span>}
                  </div>
                ))}
              </div>
              {form.payment === 'bkash' && (
                <div style={{ marginTop:'1rem', background:'#fdf2f8', border:'1px solid #fbcfe8', borderRadius:12, padding:'0.85rem 1rem', fontSize:'0.82rem', color:'#be185d' }}>
                  📱 bKash নম্বর: <strong>01XXXXXXXXX</strong> — অর্ডার confirm হলে payment করুন।
                </div>
              )}
              {form.payment === 'nagad' && (
                <div style={{ marginTop:'1rem', background:'#fff7ed', border:'1px solid #fed7aa', borderRadius:12, padding:'0.85rem 1rem', fontSize:'0.82rem', color:'#c2410c' }}>
                  🔴 Nagad নম্বর: <strong>01XXXXXXXXX</strong> — অর্ডার confirm হলে payment করুন।
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT: Order Summary ── */}
          <div style={{ position:'sticky', top:'1.5rem' }}>
            <div style={{ background:'#fff', borderRadius:20, boxShadow:'0 2px 12px rgba(0,0,0,0.06)', overflow:'hidden' }}>

              {/* Header */}
              <div style={{ padding:'1.25rem 1.5rem', background:'linear-gradient(135deg,#0a2e1e,#0d9f6e)' }}>
                <h3 style={{ fontFamily:'Syne,sans-serif', fontWeight:800, color:'#fff', margin:0, fontSize:'1rem' }}>📋 Order Summary</h3>
                <p style={{ color:'rgba(255,255,255,0.65)', fontSize:'0.78rem', margin:'3px 0 0' }}>{cart.length}টি আইটেম</p>
              </div>

              {/* Items */}
              <div style={{ padding:'1rem 1.5rem', borderBottom:'1px solid #f3f4f6', maxHeight:280, overflowY:'auto' }}>
                {cart.map(item => (
                  <div key={item.medicine_id} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 0', borderBottom:'1px solid #f9fafb' }}>
                    <div style={{ width:36, height:36, borderRadius:9, background:'#f0fdf4', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>💊</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontWeight:700, fontSize:'0.82rem', color:'#0d1117', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.name}</div>
                      <div style={{ fontSize:'0.75rem', color:'#888' }}>৳{item.price} × {item.qty}</div>
                    </div>
                    <div style={{ fontFamily:'Syne,sans-serif', fontWeight:800, color:'#0d9f6e', fontSize:'0.88rem', flexShrink:0 }}>৳{item.price*item.qty}</div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div style={{ padding:'1rem 1.5rem', borderBottom:'1px solid #f3f4f6' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8, fontSize:'0.85rem', color:'#555' }}>
                  <span>Subtotal</span><span style={{ fontWeight:600 }}>৳{total}</span>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4, fontSize:'0.85rem', color:'#555' }}>
                  <span>Delivery</span>
                  <span style={{ fontWeight:600, color: deliveryFee===0 ? '#059669' : '#555' }}>
                    {deliveryFee===0 ? '🎉 বিনামূল্যে' : `৳${deliveryFee}`}
                  </span>
                </div>
                {deliveryFee > 0 && <div style={{ fontSize:'0.72rem', color:'#aaa' }}>৳500+ অর্ডারে বিনামূল্যে ডেলিভারি</div>}
              </div>
              <div style={{ padding:'1rem 1.5rem', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'0.95rem', color:'#374151' }}>Total</span>
                <span style={{ fontFamily:'Syne,sans-serif', fontWeight:900, fontSize:'1.4rem', background:'linear-gradient(135deg,#0d9f6e,#076b49)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>৳{grandTotal}</span>
              </div>

              {/* Place Order Button */}
              <div style={{ padding:'0 1.5rem 1.5rem' }}>
                <button onClick={handleSubmit} disabled={loading||cart.length===0}
                  style={{ width:'100%', padding:'14px', background: loading||cart.length===0 ? '#9ca3af' : 'linear-gradient(135deg,#0d9f6e,#076b49)', border:'none', borderRadius:14, cursor: loading||cart.length===0 ? 'not-allowed' : 'pointer', color:'#fff', fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:'1rem', boxShadow:'0 8px 24px rgba(13,159,110,0.35)', transition:'all 0.2s', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}
                  onMouseEnter={e=>{if(!loading&&cart.length>0)(e.currentTarget as HTMLElement).style.transform='translateY(-1px)';}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform='';}}
                >
                  {loading ? (
                    <>
                      <div style={{ width:18, height:18, border:'2px solid rgba(255,255,255,0.4)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
                      অর্ডার হচ্ছে...
                    </>
                  ) : (
                    <>✅ Place Order</>
                  )}
                </button>

                {!user && (
                  <p style={{ textAlign:'center', fontSize:'0.75rem', color:'#f59e0b', marginTop:8, fontWeight:600 }}>⚠️ Login required to complete order</p>
                )}

                {/* Trust badges */}
                <div style={{ display:'flex', justifyContent:'center', gap:16, marginTop:'1rem', paddingTop:'1rem', borderTop:'1px solid #f3f4f6' }}>
                  {['🔒 Secure','🚚 Fast Delivery','✅ Genuine'].map(b=>(
                    <div key={b} style={{ fontSize:'0.7rem', color:'#aaa', fontWeight:600 }}>{b}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default CheckoutPage;

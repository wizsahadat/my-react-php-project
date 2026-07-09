import React from 'react';
import { CartItem } from '../data/api';

interface CartSidebarProps {
  cart: CartItem[];
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: number, qty: number) => void;
  onRemove: (id: number) => void;
  onCheckout: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ cart, isOpen, onClose, onUpdate, onRemove, onCheckout }) => {
  const total       = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const deliveryFee = total >= 500 ? 0 : 50;
  const grandTotal  = total + deliveryFee;

  return (
    <>
      {isOpen && (
        <div onClick={onClose} style={{ position:'fixed', inset:0, zIndex:8000, background:'rgba(0,0,0,0.4)', backdropFilter:'blur(4px)' }} />
      )}
      <div style={{
        position:'fixed', top:0, right:0, bottom:0, zIndex:8001,
        width:400, background:'#fff',
        boxShadow:'-8px 0 40px rgba(0,0,0,0.15)',
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        transition:'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
        display:'flex', flexDirection:'column'
      }}>

        {/* Header */}
        <div style={{ padding:'1.5rem', borderBottom:'1px solid #f0f0f0', display:'flex', alignItems:'center', justifyContent:'space-between', background:'linear-gradient(135deg,#0d9f6e,#076b49)' }}>
          <div>
            <h2 style={{ fontFamily:'Syne,sans-serif', fontWeight:800, color:'#fff', fontSize:'1.1rem', margin:0 }}>🛒 Your Cart</h2>
            <p style={{ fontSize:'0.78rem', color:'rgba(255,255,255,0.7)', margin:'3px 0 0' }}>
              {cart.length} item{cart.length !== 1 ? 's' : ''}
              {total >= 500 ? ' · 🎉 Free delivery!' : ` · ৳${500-total} more for free delivery`}
            </p>
          </div>
          <button onClick={onClose} style={{ width:36, height:36, borderRadius:'50%', background:'rgba(255,255,255,0.2)', border:'none', cursor:'pointer', color:'#fff', fontSize:20, display:'flex', alignItems:'center', justifyContent:'center' }}>×</button>
        </div>

        {/* Free delivery progress bar */}
        {cart.length > 0 && total < 500 && (
          <div style={{ padding:'10px 1rem', background:'#f0fdf4', borderBottom:'1px solid #dcfce7' }}>
            <div style={{ fontSize:'0.72rem', color:'#059669', fontWeight:600, marginBottom:5 }}>
              আর ৳{500-total} অর্ডার করলে বিনামূল্যে ডেলিভারি!
            </div>
            <div style={{ height:5, background:'#d1fae5', borderRadius:20, overflow:'hidden' }}>
              <div style={{ height:'100%', background:'linear-gradient(90deg,#0d9f6e,#059669)', borderRadius:20, width:`${Math.min(100,(total/500)*100)}%`, transition:'width 0.3s' }} />
            </div>
          </div>
        )}

        {/* Items */}
        <div style={{ flex:1, overflowY:'auto', padding:'1rem' }}>
          {cart.length === 0 ? (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', gap:12 }}>
              <div style={{ fontSize:56, opacity:0.3 }}>🛒</div>
              <p style={{ color:'#888', fontFamily:'Syne,sans-serif', fontWeight:600 }}>Cart খালি</p>
              <p style={{ color:'#aaa', fontSize:'0.8rem' }}>ওষুধ যোগ করুন</p>
            </div>
          ) : cart.map(item => (
            <div key={item.medicine_id} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 0', borderBottom:'1px solid #f5f5f5' }}>
              <div style={{ width:52, height:52, borderRadius:12, background:'#f0fdf4', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>
                {item.image ? (
                  <img src={item.image} alt={item.name} style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:12 }}
                    onError={e=>{(e.target as HTMLImageElement).style.display='none';}} />
                ) : '💊'}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'0.88rem', color:'#0d1117', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{item.name}</div>
                <div style={{ fontSize:'0.8rem', color:'#0d9f6e', fontWeight:600, marginTop:2 }}>
                  ৳{item.price} × {item.qty} = <strong>৳{item.price * item.qty}</strong>
                </div>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:6, flexShrink:0 }}>
                <button onClick={()=> item.qty<=1 ? onRemove(item.medicine_id) : onUpdate(item.medicine_id, item.qty-1)}
                  style={{ width:28, height:28, borderRadius:8, background:'#f3f4f6', border:'none', cursor:'pointer', fontWeight:700, fontSize:'1rem', color:'#555', display:'flex', alignItems:'center', justifyContent:'center' }}>−</button>
                <span style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'0.9rem', minWidth:20, textAlign:'center' }}>{item.qty}</span>
                <button onClick={()=>onUpdate(item.medicine_id, item.qty+1)}
                  style={{ width:28, height:28, borderRadius:8, background:'#0d9f6e', border:'none', cursor:'pointer', fontWeight:700, fontSize:'1rem', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>+</button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div style={{ padding:'1.25rem 1.5rem', borderTop:'1px solid #f0f0f0', background:'#fafafa' }}>
            {/* Subtotal */}
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.82rem', color:'#888', marginBottom:5 }}>
              <span>Subtotal</span><span style={{ fontWeight:600 }}>৳{total}</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.82rem', color:'#888', marginBottom:'0.85rem' }}>
              <span>Delivery</span>
              <span style={{ fontWeight:600, color: deliveryFee===0?'#059669':'#555' }}>
                {deliveryFee===0 ? '🎉 Free' : `৳${deliveryFee}`}
              </span>
            </div>
            {/* Total */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem' }}>
              <span style={{ fontFamily:'Syne,sans-serif', fontWeight:700, color:'#374151' }}>Total</span>
              <span style={{ fontFamily:'Syne,sans-serif', fontWeight:900, fontSize:'1.35rem', background:'linear-gradient(135deg,#0d9f6e,#076b49)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>৳{grandTotal}</span>
            </div>
            <button onClick={onCheckout}
              style={{ width:'100%', padding:'14px', background:'linear-gradient(135deg,#0d9f6e,#076b49)', border:'none', borderRadius:14, cursor:'pointer', fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:'0.95rem', color:'#fff', boxShadow:'0 8px 24px rgba(13,159,110,0.35)', transition:'all 0.2s', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform='translateY(-1px)';}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform='none';}}
            >
              🚀 Checkout করুন →
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;

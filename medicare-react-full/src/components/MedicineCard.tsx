import React, { useState } from 'react';
import { Medicine, CartItem } from '../data/api';

interface MedicineCardProps {
  medicine: Medicine;
  onAddToCart: (item: CartItem) => void;
  onView: (medicine: Medicine) => void;
}

const MedicineCard: React.FC<MedicineCardProps> = ({ medicine, onAddToCart, onView }) => {
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart({
      medicine_id: medicine.medicine_id,
      name: medicine.name,
      price: medicine.price,
      qty: 1,
      image: medicine.image
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div
      onClick={() => onView(medicine)}
      style={{
        background: '#fff', borderRadius: 20,
        border: '1.5px solid rgba(13,159,110,0.1)',
        overflow: 'hidden', cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
        position: 'relative',
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
      }}
      onMouseEnter={e => {
        const el = e.currentTarget;
        el.style.transform = 'translateY(-6px)';
        el.style.boxShadow = '0 16px 40px rgba(13,159,110,0.15)';
        el.style.borderColor = 'rgba(13,159,110,0.3)';
      }}
      onMouseLeave={e => {
        const el = e.currentTarget;
        el.style.transform = 'none';
        el.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)';
        el.style.borderColor = 'rgba(13,159,110,0.1)';
      }}
    >
      {/* Type badge */}
      <div style={{
        position: 'absolute', top: 12, left: 12, zIndex: 2,
        background: medicine.type === 'OTC' ? '#0d9f6e' : '#f43f5e',
        color: '#fff', borderRadius: 6,
        padding: '3px 8px', fontSize: '0.68rem', fontWeight: 800,
        fontFamily: 'Syne, sans-serif', letterSpacing: '0.06em'
      }}>{medicine.type}</div>

      {/* Image */}
      <div style={{
        height: 160, overflow: 'hidden',
        background: 'linear-gradient(135deg, #f0fdf8, #e6ffee)',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <img src={medicine.image} alt={medicine.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
          onError={e => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      </div>

      {/* Content */}
      <div style={{ padding: '1rem' }}>
        <div style={{
          fontSize: '0.7rem', fontWeight: 700, color: '#0d9f6e',
          fontFamily: 'Syne, sans-serif', letterSpacing: '0.06em',
          marginBottom: 4, textTransform: 'uppercase'
        }}>{medicine.company || medicine.company_name || 'Unknown'}</div>

        <h3 style={{
          fontFamily: 'Syne, sans-serif', fontWeight: 700,
          fontSize: '1rem', color: '#0d1117', marginBottom: 2
        }}>{medicine.name}</h3>

        <p style={{
          fontSize: '0.78rem', color: '#888', marginBottom: '1rem'
        }}>{medicine.generic_name}</p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{
            fontFamily: 'Syne, sans-serif', fontWeight: 800,
            fontSize: '1.1rem',
            background: 'linear-gradient(135deg, #0d9f6e, #076b49)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>৳{medicine.price}</div>

          <button
            onClick={handleAdd}
            style={{
              width: 36, height: 36, borderRadius: 10,
              background: added
                ? 'linear-gradient(135deg, #10b981, #059669)'
                : 'linear-gradient(135deg, #0d9f6e, #076b49)',
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, color: '#fff',
              boxShadow: '0 4px 12px rgba(13,159,110,0.35)',
              transition: 'all 0.2s',
              transform: added ? 'scale(1.1)' : 'scale(1)'
            }}
          >
            {added ? '✓' : '+'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedicineCard;

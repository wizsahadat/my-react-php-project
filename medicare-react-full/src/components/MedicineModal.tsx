import React from 'react';
import { Medicine, CartItem } from '../data/api';

interface MedicineModalProps {
  medicine: Medicine | null;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
}

const MedicineModal: React.FC<MedicineModalProps> = ({ medicine, onClose, onAddToCart }) => {
  if (!medicine) return null;

  const fields = [
    { label: 'Drug Class', value: medicine.drug_class, color: '#0d9f6e' },
    { label: 'Type', value: medicine.type, color: '#8b5cf6' },
    { label: 'Dosage Form', value: medicine.dosage_form, color: '#f97316' },
    { label: 'Strength', value: medicine.strength, color: '#f43f5e' },
  ];

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9000,
        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem', animation: 'fadeUp 0.2s ease both'
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff', borderRadius: 24,
          maxWidth: 680, width: '100%', maxHeight: '90vh',
          overflow: 'auto', position: 'relative',
          boxShadow: '0 24px 80px rgba(0,0,0,0.25)'
        }}
      >
        {/* Close */}
        <button onClick={onClose} style={{
          position: 'absolute', top: 16, right: 16, zIndex: 10,
          width: 36, height: 36, borderRadius: '50%',
          background: '#f3f4f6', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, color: '#666', transition: 'all 0.2s'
        }}
          onMouseEnter={e => { e.currentTarget.style.background = '#fee2e2'; e.currentTarget.style.color = '#ef4444'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#f3f4f6'; e.currentTarget.style.color = '#666'; }}
        >×</button>

        {/* Header */}
        <div style={{ padding: '1.5rem 1.5rem 0' }}>
          <div style={{
            fontSize: '0.7rem', fontWeight: 700, color: '#888',
            letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4
          }}>{medicine.company || medicine.company_name || ''}</div>
          <h2 style={{
            fontFamily: 'Syne, sans-serif', fontWeight: 800,
            fontSize: '1.8rem', color: '#0d1117', marginBottom: 2
          }}>{medicine.name}</h2>
          <p style={{ color: '#888', fontSize: '0.9rem', fontStyle: 'italic' }}>{medicine.generic_name}</p>
        </div>

        {/* Image */}
        <div style={{
          margin: '1.5rem',
          borderRadius: 16, overflow: 'hidden',
          background: 'linear-gradient(135deg, #f0fdf8, #ecfdf5)',
          height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <img src={medicine.image} alt={medicine.name}
            style={{ maxHeight: '100%', maxWidth: '60%', objectFit: 'contain' }}
          />
        </div>

        {/* Fields Grid */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: 12, padding: '0 1.5rem 1.5rem'
        }}>
          {fields.map(f => (
            <div key={f.label} style={{
              padding: '1rem', borderRadius: 12,
              borderLeft: `4px solid ${f.color}`,
              background: `${f.color}08`
            }}>
              <div style={{
                fontSize: '0.68rem', fontWeight: 700, color: f.color,
                letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4
              }}>{f.label}</div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, color: '#0d1117' }}>{f.value}</div>
            </div>
          ))}
        </div>

        {/* Description */}
        <div style={{ padding: '0 1.5rem 1.5rem' }}>
          <h4 style={{
            fontFamily: 'Syne, sans-serif', fontWeight: 700,
            color: '#0d1117', marginBottom: '0.5rem', fontSize: '0.85rem'
          }}>📋 Description</h4>
          <p style={{ fontSize: '0.88rem', color: '#4a5568', lineHeight: 1.7 }}>
            {medicine.description}
          </p>
        </div>

        <div style={{ padding: '0 1.5rem 1.5rem' }}>
          <h4 style={{
            fontFamily: 'Syne, sans-serif', fontWeight: 700,
            color: '#f43f5e', marginBottom: '0.5rem', fontSize: '0.85rem'
          }}>⚠️ Side Effects</h4>
          <p style={{ fontSize: '0.88rem', color: '#4a5568', lineHeight: 1.7 }}>
            {medicine.side_effects}
          </p>
        </div>

        {/* Footer */}
        <div style={{
          padding: '1.5rem', borderTop: '1px solid #f0f0f0',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#888' }}>Price</div>
            <div style={{
              fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.8rem',
              background: 'linear-gradient(135deg, #0d9f6e, #076b49)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>৳{medicine.price}</div>
          </div>
          <button onClick={() => {
            onAddToCart({
              medicine_id: medicine.medicine_id,
              name: medicine.name, price: medicine.price,
              qty: 1, image: medicine.image
            });
            onClose();
          }} style={{
            background: 'linear-gradient(135deg, #0d9f6e, #076b49)',
            border: 'none', borderRadius: 14, padding: '14px 32px',
            cursor: 'pointer', fontFamily: 'Syne, sans-serif',
            fontWeight: 700, fontSize: '0.95rem', color: '#fff',
            boxShadow: '0 8px 24px rgba(13,159,110,0.35)',
            display: 'flex', alignItems: 'center', gap: 8,
            transition: 'all 0.2s'
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}
          >
            🛒 Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedicineModal;

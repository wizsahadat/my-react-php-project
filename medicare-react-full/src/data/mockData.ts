export interface Medicine {
  medicine_id: number;
  name: string;
  generic_name: string;
  manufacturer: string;
  price: number;
  type: 'OTC' | 'RX';
  category_id: number;
  drug_class: string;
  dosage_form: string;
  strength: string;
  description: string;
  side_effects: string;
  stock: number;
  image: string;
}

export interface Category {
  category_id: number;
  name: string;
  count: number;
  icon: string;
  color: string;
  accent: string;
}

export const categories: Category[] = [
  { category_id: 1, name: 'Cardiology', count: 142, icon: '❤️', color: '#fee2e2', accent: '#ef4444' },
  { category_id: 2, name: 'Allergy', count: 87, icon: '🤧', color: '#fef3c7', accent: '#f59e0b' },
  { category_id: 3, name: 'Neurology', count: 63, icon: '🧠', color: '#ede9fe', accent: '#8b5cf6' },
  { category_id: 4, name: 'Antibiotics', count: 210, icon: '💊', color: '#fce7f3', accent: '#ec4899' },
  { category_id: 5, name: 'Vitamins', count: 95, icon: '🍎', color: '#d1fae5', accent: '#10b981' },
  { category_id: 6, name: 'Respiratory', count: 74, icon: '🫁', color: '#e0f2fe', accent: '#0ea5e9' },
  { category_id: 7, name: 'Orthopedic', count: 56, icon: '🦴', color: '#fef9c3', accent: '#eab308' },
  { category_id: 8, name: 'Eye Care', count: 38, icon: '👁️', color: '#f3e8ff', accent: '#a855f7' },
  { category_id: 9, name: 'Gastrointestinal', count: 91, icon: '🫀', color: '#ffedd5', accent: '#f97316' },
  { category_id: 10, name: 'Diabetes', count: 67, icon: '🩺', color: '#ecfdf5', accent: '#059669' },
];

export const medicines: Medicine[] = [
  {
    medicine_id: 1, name: 'Napa', generic_name: 'Paracetamol', manufacturer: 'Beximco Pharma',
    price: 120, type: 'OTC', category_id: 2, drug_class: 'Analgesic / Antipyretic',
    dosage_form: 'Tablet', strength: '500mg',
    description: 'Paracetamol is used to relieve mild to moderate pain and fever. It works by blocking certain chemicals in the body that cause pain and fever.',
    side_effects: 'Nausea, rash, liver damage (with overdose). Rare: allergic reactions.',
    stock: 500, image: 'https://placehold.co/300x200/d1fae5/0d9f6e?text=Napa'
  },
  {
    medicine_id: 2, name: 'Citin 10mg', generic_name: 'Cetirizine HCl', manufacturer: 'Renata Limited',
    price: 50, type: 'OTC', category_id: 2, drug_class: 'Antihistamine',
    dosage_form: 'Tablet', strength: '10mg',
    description: 'Cetirizine is used to treat hay fever, allergies, hives and other allergic conditions. It relieves sneezing, runny nose, itching and watery eyes.',
    side_effects: 'Drowsiness, dry mouth, headache, dizziness.',
    stock: 320, image: 'https://placehold.co/300x200/fce7f3/9d174d?text=Citin'
  },
  {
    medicine_id: 3, name: 'Fexo 120', generic_name: 'Fexofenadine HCl', manufacturer: 'Square Pharmaceuticals',
    price: 81, type: 'OTC', category_id: 2, drug_class: 'Antihistamine',
    dosage_form: 'Tablet', strength: '120mg',
    description: 'Fexofenadine is a non-drowsy antihistamine used to relieve allergy symptoms such as runny nose, sneezing, and itchy eyes.',
    side_effects: 'Headache, nausea, dizziness. Generally well-tolerated.',
    stock: 180, image: 'https://placehold.co/300x200/ede9fe/5b21b6?text=Fexo'
  },
  {
    medicine_id: 4, name: 'Biltin', generic_name: 'Bilastine', manufacturer: 'Eskayef Bangladesh Ltd.',
    price: 140, type: 'OTC', category_id: 2, drug_class: 'Antihistamine',
    dosage_form: 'Tablet', strength: '20mg',
    description: 'Bilastine is an antihistamine used for the treatment of allergic rhinoconjunctivitis and urticaria. It does not penetrate the blood-brain barrier well.',
    side_effects: 'Headache, somnolence, fatigue, nausea.',
    stock: 90, image: 'https://placehold.co/300x200/d1fae5/065f46?text=Biltin'
  },
  {
    medicine_id: 5, name: 'Atova 10', generic_name: 'Atorvastatin', manufacturer: 'ACI Limited',
    price: 200, type: 'RX', category_id: 1, drug_class: 'Statin / Lipid-lowering',
    dosage_form: 'Tablet', strength: '10mg',
    description: 'Atorvastatin is used to treat high cholesterol and to lower the risk of stroke, heart attack, and other heart or blood vessel diseases.',
    side_effects: 'Muscle pain, joint pain, diarrhea, upset stomach.',
    stock: 240, image: 'https://placehold.co/300x200/fee2e2/991b1b?text=Atova'
  },
  {
    medicine_id: 6, name: 'Bislol 5', generic_name: 'Bisoprolol', manufacturer: 'Healthcare Pharma',
    price: 180, type: 'RX', category_id: 1, drug_class: 'Beta-Blocker',
    dosage_form: 'Tablet', strength: '5mg',
    description: 'Bisoprolol is a beta-blocker used to treat high blood pressure, heart failure, and angina. It slows the heart rate and reduces blood pressure.',
    side_effects: 'Fatigue, dizziness, cold hands/feet, slow heartbeat.',
    stock: 160, image: 'https://placehold.co/300x200/fef3c7/92400e?text=Bislol'
  },
  {
    medicine_id: 7, name: 'AtoZ Vitamin', generic_name: 'Multivitamin', manufacturer: 'Square Pharmaceuticals',
    price: 350, type: 'OTC', category_id: 5, drug_class: 'Vitamin / Supplement',
    dosage_form: 'Tablet', strength: 'Standard',
    description: 'A comprehensive multivitamin and mineral supplement providing essential nutrients for overall health and wellbeing.',
    side_effects: 'Generally safe. High doses may cause nausea.',
    stock: 400, image: 'https://placehold.co/300x200/d1fae5/065f46?text=AtoZ'
  },
  {
    medicine_id: 8, name: 'Cefacla 500', generic_name: 'Cephalexin', manufacturer: 'Opsonin Pharma',
    price: 95, type: 'RX', category_id: 4, drug_class: 'Antibiotic (Cephalosporin)',
    dosage_form: 'Capsule', strength: '500mg',
    description: 'Cephalexin is a first-generation cephalosporin antibiotic used to treat bacterial infections of the skin, bone, and urinary tract.',
    side_effects: 'Diarrhea, nausea, vomiting, stomach pain.',
    stock: 275, image: 'https://placehold.co/300x200/fce7f3/be185d?text=Cefacla'
  },
  {
    medicine_id: 9, name: 'Calbo-D', generic_name: 'Calcium + Vitamin D3', manufacturer: 'Renata Limited',
    price: 160, type: 'OTC', category_id: 5, drug_class: 'Mineral / Supplement',
    dosage_form: 'Tablet', strength: '500mg+400IU',
    description: 'Calcium and Vitamin D3 combination for bone health, prevention and treatment of calcium deficiency.',
    side_effects: 'Constipation, nausea, hypercalcemia with excessive use.',
    stock: 310, image: 'https://placehold.co/300x200/fef9c3/92400e?text=Calbo'
  },
  {
    medicine_id: 10, name: 'Bazoran', generic_name: 'Omeprazole', manufacturer: 'Incepta Pharmaceuticals',
    price: 75, type: 'OTC', category_id: 9, drug_class: 'Proton Pump Inhibitor',
    dosage_form: 'Capsule', strength: '20mg',
    description: 'Omeprazole reduces stomach acid and is used to treat gastroesophageal reflux disease (GERD), stomach ulcers, and other acid-related conditions.',
    side_effects: 'Headache, diarrhea, nausea, abdominal pain.',
    stock: 420, image: 'https://placehold.co/300x200/ffedd5/c2410c?text=Bazoran'
  },
  {
    medicine_id: 11, name: 'Fylo 150', generic_name: 'Fluconazole', manufacturer: 'ACI Limited',
    price: 110, type: 'RX', category_id: 4, drug_class: 'Antifungal',
    dosage_form: 'Capsule', strength: '150mg',
    description: 'Fluconazole is an antifungal antibiotic used to treat fungal infections of the vagina, mouth, throat, esophagus, lungs, and blood.',
    side_effects: 'Nausea, headache, rash, abdominal pain.',
    stock: 150, image: 'https://placehold.co/300x200/f3e8ff/7e22ce?text=Fylo'
  },
  {
    medicine_id: 12, name: 'Alatol', generic_name: 'Atenolol', manufacturer: 'Square Pharmaceuticals',
    price: 45, type: 'RX', category_id: 1, drug_class: 'Beta-Blocker',
    dosage_form: 'Tablet', strength: '50mg',
    description: 'Atenolol is a beta-blocker that is used to treat angina (chest pain) and high blood pressure. It also helps to lower the risk of death after a heart attack.',
    side_effects: 'Dizziness, fatigue, cold extremities, bradycardia.',
    stock: 290, image: 'https://placehold.co/300x200/fee2e2/b91c1c?text=Alatol'
  },
];

export interface CartItem {
  medicine_id: number;
  name: string;
  price: number;
  qty: number;
  image: string;
}

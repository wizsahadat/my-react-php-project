// =============================================
// MediCare — Real PHP Backend API
// =============================================

const BASE = 'http://localhost/medicare-backend/api';

export interface Medicine {
  medicine_id: number;
  name: string;
  generic_name: string;
  company: string;
  company_name?: string;
  price: number;
  type: string;
  category_id: number;
  category_name?: string;
  drug_class: string;
  dosage_form: string;
  strength: string;
  description: string;
  dosage?: string;
  side_effects: string;
  stock: number;
  image: string;
  is_featured?: number;
}

export interface Category {
  category_id: number;
  name: string;
  medicine_count: number;
  icon: string;
  description?: string;
}

export interface CartItem {
  medicine_id: number;
  name: string;
  price: number;
  qty: number;
  image: string;
}

// ── Categories ──
export async function fetchCategories(): Promise<Category[]> {
  const res = await fetch(`${BASE}/categories.php`, { credentials: 'include' });
  const data = await res.json();
  return data.categories || [];
}

// ── Medicines ──
export async function fetchMedicines(params: {
  q?: string;
  category?: number;
  type?: string;
  sort?: string;
  page?: number;
} = {}): Promise<{ medicines: Medicine[]; total: number; totalPages: number }> {
  const url = new URL(`${BASE}/medicines.php`);
  url.searchParams.set('action', 'list');
  if (params.q) url.searchParams.set('q', params.q);
  if (params.category) url.searchParams.set('category', String(params.category));
  if (params.type) url.searchParams.set('type', params.type);
  if (params.sort) url.searchParams.set('sort', params.sort);
  if (params.page) url.searchParams.set('page', String(params.page));

  const res = await fetch(url.toString(), { credentials: 'include' });
  const data = await res.json();
  return {
    medicines: data.medicines || [],
    total: data.total || 0,
    totalPages: data.totalPages || 1
  };
}

// ── Featured Medicines ──
export async function fetchFeatured(): Promise<Medicine[]> {
  const res = await fetch(`${BASE}/medicines.php?action=featured`, { credentials: 'include' });
  const data = await res.json();
  return data.medicines || [];
}

// ── Single Medicine ──
export async function fetchMedicine(id: number): Promise<Medicine | null> {
  const res = await fetch(`${BASE}/medicines.php?action=single&id=${id}`, { credentials: 'include' });
  const data = await res.json();
  return data.medicine || null;
}

// ── Live Search ──
export async function searchMedicines(q: string): Promise<Medicine[]> {
  if (q.length < 2) return [];
  const res = await fetch(`${BASE}/search.php?q=${encodeURIComponent(q)}`, { credentials: 'include' });
  return await res.json();
}

// ── Auth ──
export async function login(email: string, password: string) {
  const body = new URLSearchParams({ email, password });
  const res = await fetch(`${BASE}/auth.php?action=login`, {
    method: 'POST', body, credentials: 'include'
  });
  return await res.json();
}

export async function register(name: string, email: string, phone: string, password: string) {
  const body = new URLSearchParams({ name, email, phone, password });
  const res = await fetch(`${BASE}/auth.php?action=register`, {
    method: 'POST', body, credentials: 'include'
  });
  return await res.json();
}

export async function logout() {
  await fetch(`${BASE}/auth.php?action=logout`, { credentials: 'include' });
}

export async function checkSession() {
  const res = await fetch(`${BASE}/auth.php?action=check`, { credentials: 'include' });
  return await res.json();
}

// ── Cart ──
export async function addToCart(medicine_id: number, qty = 1) {
  const res = await fetch(`${BASE}/cart.php?action=add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ medicine_id, qty })
  });
  return await res.json();
}

export async function getCart(): Promise<CartItem[]> {
  const res = await fetch(`${BASE}/cart.php?action=get`, { credentials: 'include' });
  const data = await res.json();
  return data.cart || [];
}

export async function updateCartItem(medicine_id: number, qty: number) {
  const res = await fetch(`${BASE}/cart.php?action=update`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ medicine_id, qty })
  });
  return await res.json();
}

export async function removeFromCart(medicine_id: number) {
  const res = await fetch(`${BASE}/cart.php?action=remove`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ medicine_id })
  });
  return await res.json();
}

// ── Admin API ──
const ADMIN_BASE = 'http://localhost/medicare-backend/api/admin.php';

export async function adminStats() {
  const res = await fetch(`${ADMIN_BASE}?action=stats`, { credentials: 'include' });
  return await res.json();
}
export async function adminMedicines(page = 1, q = '') {
  const res = await fetch(`${ADMIN_BASE}?action=medicines&page=${page}&q=${encodeURIComponent(q)}`, { credentials: 'include' });
  return await res.json();
}
export async function adminUpdateMedicine(data: any) {
  const res = await fetch(`${ADMIN_BASE}?action=update_medicine`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(data) });
  return await res.json();
}
export async function adminDeleteMedicine(id: number) {
  const res = await fetch(`${ADMIN_BASE}?action=delete_medicine`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ medicine_id: id }) });
  return await res.json();
}
export async function adminOrders(page = 1, status = '') {
  const res = await fetch(`${ADMIN_BASE}?action=orders&page=${page}&status=${status}`, { credentials: 'include' });
  return await res.json();
}
export async function adminOrderDetail(id: number) {
  const res = await fetch(`${ADMIN_BASE}?action=order_detail&id=${id}`, { credentials: 'include' });
  return await res.json();
}
export async function adminUpdateOrder(order_id: number, status: string) {
  const res = await fetch(`${ADMIN_BASE}?action=update_order`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ order_id, status }) });
  return await res.json();
}
export async function adminUsers(page = 1, q = '') {
  const res = await fetch(`${ADMIN_BASE}?action=users&page=${page}&q=${encodeURIComponent(q)}`, { credentials: 'include' });
  return await res.json();
}
export async function adminDeleteUser(user_id: number) {
  const res = await fetch(`${ADMIN_BASE}?action=delete_user`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ user_id }) });
  return await res.json();
}
export async function adminMedicineDetail(id: number) {
  const res = await fetch(`${ADMIN_BASE}?action=medicine_detail&id=${id}`, { credentials: 'include' });
  return await res.json();
}
export async function adminAddMedicine(data: any) {
  const res = await fetch(`${ADMIN_BASE}?action=add_medicine`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(data) });
  return await res.json();
}
export async function adminCategories() {
  const res = await fetch(`${ADMIN_BASE}?action=categories`, { credentials: 'include' });
  return await res.json();
}
export async function adminInventory(q = '', filter = 'all') {
  const res = await fetch(`${ADMIN_BASE}?action=inventory&q=${encodeURIComponent(q)}&filter=${filter}`, { credentials: 'include' });
  return await res.json();
}

// ── Place Order ──
export async function placeOrder(data: {
  name: string; phone: string; address: string;
  notes?: string; payment: string; items: CartItem[];
}) {
  const res = await fetch(`${BASE}/orders.php?action=place`, {
    method: 'POST', credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return await res.json();
}

// ── Delivery Management ──
const DELIVERY_BASE = 'http://localhost/medicare-backend/api/delivery.php';

export interface DeliveryMan {
  delivery_man_id: number;
  name: string;
  phone: string;
  email?: string;
  vehicle?: string;
  area?: string;
  status: 'active' | 'inactive';
  total_assigned?: number;
  total_delivered?: number;
  active_orders?: number;
  created_at?: string;
}

export async function fetchDeliveryMen(): Promise<DeliveryMan[]> {
  const res = await fetch(`${DELIVERY_BASE}?action=list`, { credentials: 'include' });
  const data = await res.json();
  return data.delivery_men || [];
}

export async function addDeliveryMan(data: { name: string; phone: string; email?: string; vehicle?: string; area?: string; }) {
  const res = await fetch(`${DELIVERY_BASE}?action=add`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(data) });
  return await res.json();
}

export async function updateDeliveryMan(data: { delivery_man_id: number; name: string; phone: string; email?: string; vehicle?: string; area?: string; status: 'active' | 'inactive'; }) {
  const res = await fetch(`${DELIVERY_BASE}?action=update`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(data) });
  return await res.json();
}

export async function deleteDeliveryMan(delivery_man_id: number) {
  const res = await fetch(`${DELIVERY_BASE}?action=delete`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ delivery_man_id }) });
  return await res.json();
}

export async function assignDeliveryMan(order_id: number, delivery_man_id: number) {
  const res = await fetch(`${DELIVERY_BASE}?action=assign`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ order_id, delivery_man_id }) });
  return await res.json();
}

export async function updateDeliveryStatus(order_id: number, delivery_status: string) {
  const res = await fetch(`${DELIVERY_BASE}?action=update_status`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ order_id, delivery_status }) });
  return await res.json();
}

export async function deliveryStats() {
  const res = await fetch(`${DELIVERY_BASE}?action=stats`, { credentials: 'include' });
  return await res.json();
}

// ── My Orders ──
export async function myOrders() {
  const res = await fetch(`${BASE}/orders.php?action=my`, { credentials: 'include' });
  return await res.json();
}

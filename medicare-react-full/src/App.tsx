import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import './index.css';
import Navbar         from './components/Navbar';
import CartSidebar    from './components/CartSidebar';
import LoginModal     from './components/LoginModal';
import MedicineModal  from './components/MedicineModal';
import CheckoutPage   from './pages/CheckoutPage';
import HomePage       from './pages/HomePage';
import ProductsPage   from './pages/ProductsPage';
import CategoriesPage from './pages/CategoriesPage';
import AIPage         from './pages/AIPage';
import AdminApp       from './admin/AdminApp';
import AdminLoginPage from './admin/pages/AdminLoginPage';
import { CartItem, Medicine, checkSession, logout } from './data/api';
import PrescriptionModal from './components/PrescriptionModal';

type Page = 'home' | 'products' | 'categories' | 'ai' | 'checkout';

function MainApp() {
  const [page,       setPage]       = useState<Page>('home');
  const [pageExtra,  setPageExtra]  = useState<any>(null);
  const [cart,       setCart]       = useState<CartItem[]>([]);
  const [cartOpen,   setCartOpen]   = useState(false);
  const [loginOpen,  setLoginOpen]  = useState(false);
  const [rxOpen,      setRxOpen]      = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [user, setUser] = useState<{ name: string; email: string; role?: string } | null>(null);

  useEffect(() => {
    checkSession().then(data => {
      if (data.loggedIn) setUser({ name: data.name, email: data.email, role: data.role });
    }).catch(() => {});
  }, []);

  const navigate = (p: string, extra?: any) => {
    if (p === 'productDetail' && extra) { setSelectedMedicine(extra); return; }
    setPage(p as Page);
    setPageExtra(extra || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const ex = prev.find(i => i.medicine_id === item.medicine_id);
      if (ex) return prev.map(i => i.medicine_id === item.medicine_id ? {...i, qty: i.qty + item.qty} : i);
      return [...prev, item];
    });
  };

  const updateCart     = (id: number, qty: number) => setCart(prev => prev.map(i => i.medicine_id===id ? {...i, qty} : i));
  const removeFromCart = (id: number) => setCart(prev => prev.filter(i => i.medicine_id !== id));

  const handleLogout = async () => { await logout(); setUser(null); };

  const handleLoginSuccess = (u: { name: string; email: string; role?: string }) => {
    setUser(u); setLoginOpen(false);
  };

  const goCheckout = () => {
    setCartOpen(false);
    navigate('checkout');
  };

  const handleOrderSuccess = (orderId: number) => {
    setCart([]); // clear cart after order
    setTimeout(() => navigate('home'), 4000); // go home after 4s
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      {page !== 'checkout' && (
        <Navbar
          cart={cart}
          onOpenCart={() => setCartOpen(true)}
          onOpenLogin={() => setLoginOpen(true)}
          onNavigate={navigate}
          currentPage={page}
          user={user}
          onLogout={handleLogout}
          onOpenRx={() => setRxOpen(true)}
        />
      )}

      {page === 'home'       && <HomePage onNavigate={navigate} onAddToCart={addToCart} />}
      {page === 'products'   && <ProductsPage onAddToCart={addToCart} onViewMedicine={m=>setSelectedMedicine(m)} initialCategoryId={pageExtra?.categoryId} onNavigate={navigate} />}
      {page === 'categories' && <CategoriesPage onNavigate={navigate} />}
      {page === 'ai'         && <AIPage onNavigate={navigate} />}
      {page === 'checkout'   && (
        <CheckoutPage
          cart={cart}
          user={user}
          onOrderSuccess={handleOrderSuccess}
          onBack={() => navigate('products')}
          onOpenLogin={() => setLoginOpen(true)}
        />
      )}

      <CartSidebar
        cart={cart} isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onUpdate={updateCart}
        onRemove={removeFromCart}
        onCheckout={goCheckout}
      />
      <LoginModal    isOpen={loginOpen} onClose={() => setLoginOpen(false)} onLoginSuccess={handleLoginSuccess} />
      <PrescriptionModal isOpen={rxOpen} onClose={() => setRxOpen(false)} user={user} onOpenLogin={() => { setRxOpen(false); setLoginOpen(true); }} />
      <MedicineModal medicine={selectedMedicine} onClose={() => setSelectedMedicine(null)} onAddToCart={item => { addToCart(item); setSelectedMedicine(null); }} />
    </div>
  );
}

function AdminRoute() {
  const [status,    setStatus]    = useState<'loading'|'admin'|'login'>('loading');
  const [adminName, setAdminName] = useState('');

  useEffect(() => {
    checkSession().then(data => {
      if (data.loggedIn && data.role === 'admin') { setAdminName(data.name); setStatus('admin'); }
      else setStatus('login');
    }).catch(() => setStatus('login'));
  }, []);

  if (status === 'loading') return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0a2e1e' }}>
      <div style={{ color:'#4ade80', fontFamily:'Syne,sans-serif', fontSize:'1.1rem' }}>⏳ Loading...</div>
    </div>
  );

  if (status === 'login') return <AdminLoginPage onLoginSuccess={name => { setAdminName(name); setStatus('admin'); }} />;
  return <AdminApp adminName={adminName} onExitAdmin={() => { logout(); setStatus('login'); }} />;
}

function App() {
  return (
    <Routes>
      <Route path="/admin/*" element={<AdminRoute />} />
      <Route path="/*"       element={<MainApp />} />
    </Routes>
  );
}

export default App;

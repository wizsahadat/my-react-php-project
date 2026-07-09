import React, { useState } from 'react';
import AdminLayout from './components/AdminLayout';
import DashboardPage          from './pages/DashboardPage';
import MedicinesAdminPage     from './pages/MedicinesAdminPage';
import OrdersAdminPage        from './pages/OrdersAdminPage';
import PrescriptionsAdminPage from './pages/PrescriptionsAdminPage';
import UsersAdminPage         from './pages/UsersAdminPage';
import InventoryAdminPage     from './pages/InventoryAdminPage';
import SalesAdminPage         from './pages/SalesAdminPage';
import ServicesAdminPage      from './pages/ServicesAdminPage';
import DeliveryAdminPage      from './pages/DeliveryAdminPage';

interface AdminAppProps {
  onExitAdmin: () => void;
  adminName?: string;
}

const AdminApp: React.FC<AdminAppProps> = ({ onExitAdmin, adminName }) => {
  const [activePage, setActivePage] = useState('dashboard');

  return (
    <AdminLayout
      activePage={activePage}
      onNavigate={setActivePage}
      onExitAdmin={onExitAdmin}
      adminName={adminName}
    >
      {activePage === 'dashboard'     && <DashboardPage />}
      {activePage === 'medicines'     && <MedicinesAdminPage />}
      {activePage === 'orders'        && <OrdersAdminPage />}
      {activePage === 'prescriptions' && <PrescriptionsAdminPage />}
      {activePage === 'users'         && <UsersAdminPage />}
      {activePage === 'inventory'     && <InventoryAdminPage />}
      {activePage === 'sales'         && <SalesAdminPage />}
      {activePage === 'services'      && <ServicesAdminPage />}
      {activePage === 'delivery'      && <DeliveryAdminPage />}
    </AdminLayout>
  );
};

export default AdminApp;

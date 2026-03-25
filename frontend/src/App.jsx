import React from 'react';
import { Navigate, Route, Routes, Outlet, useLocation } from 'react-router-dom';
import { message } from 'antd';

import LoginPage from './components/auth/LoginPage.jsx';
import AppLayout from './components/layout/AppLayout.jsx';

import DashboardPage from './components/dashboard/DashboardPage.jsx';
import ObservationsPage from './components/observations/ObservationsPage.jsx';
import ActionsPage from './components/actions/ActionsPage.jsx';
import AdminPage from './components/admin/AdminPage.jsx';

import { useAuth } from './context/AuthContext.jsx';

function ProtectedRoute() {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    message.warning('Please sign in to continue.');
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="observations" element={<ObservationsPage />} />
          <Route path="actions" element={<ActionsPage />} />
          <Route path="admin" element={<AdminPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}


import React, { useEffect } from 'react';
import { Alert, message, Tabs } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

import AdminStatBar from './shared/AdminStatBar.jsx';
import FormBuilderTab from './tabs/FormBuilderTab.jsx';
import CategoriesTab from './tabs/CategoriesTab.jsx';
import LocationsTab from './tabs/LocationsTab.jsx';
import RemindersTab from './tabs/RemindersTab.jsx';
import ObservationsAdminTab from './tabs/ObservationsAdminTab.jsx';
import ActionsAdminTab from './tabs/ActionsAdminTab.jsx';
import UsersTab from './tabs/UsersTab.jsx';
import AuditLogTab from './tabs/AuditLogTab.jsx';

export default function AdminPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) return;
    if (currentUser.role !== 'super_admin') {
      message.warning('Admin access is restricted to Super Admin.');
      navigate('/dashboard', { replace: true });
    }
  }, [currentUser, navigate]);

  const tabItems = [
    { key: 'forms', label: '🔧 Form Builder', children: <FormBuilderTab /> },
    { key: 'categories', label: '🏷 Categories', children: <CategoriesTab /> },
    { key: 'locations', label: '📍 Locations & Depts', children: <LocationsTab /> },
    { key: 'reminders', label: '🔔 Reminders', children: <RemindersTab /> },
    { key: 'observations', label: '👁 Observations', children: <ObservationsAdminTab /> },
    { key: 'actions', label: '⚡ Action Items', children: <ActionsAdminTab /> },
    { key: 'users', label: '👥 Users', children: <UsersTab /> },
    { key: 'auditlog', label: '📋 Audit Log', children: <AuditLogTab /> },
  ];

  return (
    <div>
      <h2 style={{ margin: '0 0 10px' }}>Admin Panel</h2>
      <AdminStatBar />
      <div style={{ marginTop: 12 }}>
        <Alert
          showIcon
          type="info"
          message="Changes are reflected immediately in the portal forms and tables."
          style={{ borderRadius: 12 }}
        />
      </div>
      <div style={{ marginTop: 12 }}>
        <Tabs items={tabItems} tabPosition="top" />
      </div>
    </div>
  );
}


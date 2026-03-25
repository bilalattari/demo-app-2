import React, { useMemo } from 'react';
import { Menu } from 'antd';
import {
  DashboardOutlined,
  FireOutlined,
  EyeOutlined,
  ThunderboltOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../theme/colors';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();

  const selectedKey = useMemo(() => {
    const path = location.pathname || '';
    if (path.startsWith('/dashboard')) return 'dashboard';
    if (path.startsWith('/observations')) return 'observations';
    if (path.startsWith('/actions')) return 'actions';
    if (path.startsWith('/admin')) return 'admin';
    return 'dashboard';
  }, [location.pathname]);

  const items = [
    {
      key: 'dashboard',
      label: '🏠 Dashboard',
      icon: <DashboardOutlined />,
      onClick: () => navigate('/dashboard'),
    },
    {
      key: 'observations',
      label: '👁 Observations',
      icon: <EyeOutlined />,
      onClick: () => navigate('/observations'),
    },
    {
      key: 'actions',
      label: '⚡ Action Items',
      icon: <ThunderboltOutlined />,
      onClick: () => navigate('/actions'),
    },
    ...(currentUser?.role === 'super_admin'
      ? [
          {
            key: 'admin',
            label: '👤 Admin',
            icon: <UserOutlined />,
            onClick: () => navigate('/admin'),
          },
        ]
      : []),
  ];

  // antd Menu doesn't allow per-item click handler in items when using v5.
  const menuItems = items.map((it) => ({
    key: it.key,
    icon: it.icon,
    label: it.label,
  }));

  return (
    <div style={{ height: '100%', background: COLORS.brandBlue, display: 'flex', flexDirection: 'column' }}>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[selectedKey]}
        items={menuItems}
        onClick={(e) => {
          const target = items.find((it) => it.key === e.key);
          target?.onClick?.();
        }}
        style={{
          background: COLORS.brandBlue,
          borderRight: 0,
          paddingTop: 14,
        }}
      />

      <div style={{ marginTop: 'auto', padding: 16, color: '#fff', fontSize: 12, opacity: 0.9 }}>
        12Monday Technologies
      </div>
    </div>
  );
}


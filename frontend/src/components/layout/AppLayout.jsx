import React from 'react';
import { Button, Layout, Tag } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { Outlet, useNavigate } from 'react-router-dom';

import Sidebar from './Sidebar.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { COLORS } from '../../theme/colors.js';

const { Header, Content, Sider } = Layout;

function roleTagColor(role) {
  switch (role) {
    case 'super_admin':
      return { color: '#DC2626', text: 'Super Admin' };
    case 'hseq_officer':
      return { color: '#2E6DB4', text: 'HSEQ Officer' };
    case 'focal_person':
      return { color: '#D97706', text: 'Focal Person' };
    case 'employee':
      return { color: '#6B7280', text: 'Employee' };
    default:
      return { color: '#6B7280', text: role };
  }
}

export default function AppLayout() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const tag = roleTagColor(currentUser?.role);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={240} style={{ background: COLORS.brandBlue }}>
        <Sidebar />
      </Sider>
      <Layout>
        <Header
          style={{
            background: '#fff',
            padding: '0 18px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ fontWeight: 700, color: COLORS.darkText }}>{currentUser?.name}</div>
            <Tag color={tag.color} style={{ border: 'none' }}>
              {tag.text}
            </Tag>
          </div>
          <Button
            icon={<LogoutOutlined />}
            onClick={() => {
              logout();
              navigate('/login', { replace: true });
            }}
          >
            Logout
          </Button>
        </Header>

        <Content style={{ background: COLORS.lightBg, padding: 24 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}


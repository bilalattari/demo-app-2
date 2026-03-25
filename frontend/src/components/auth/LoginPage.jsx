import React, { useMemo, useState } from 'react';
import { Button, Card, Col, Collapse, Form, Input, Row, Space, Table, Typography, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import { MOCK_USERS } from '../../data/mockData';
import { COLORS } from '../../theme/colors';
import { useAuth } from '../../context/AuthContext';

const { Title, Text } = Typography;

function DemoCredentialsTable({ onPick }) {
  const data = useMemo(
    () =>
      MOCK_USERS.map((u) => ({
        key: u.id,
        role: u.role,
        email: u.email,
        password: u.password,
      })),
    []
  );

  const columns = [
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role, row) => (
        <Button
          type="link"
          onClick={() => {
            onPick?.({ email: row.email, password: row.password, role });
          }}
          style={{ padding: 0 }}
        >
          {role}
        </Button>
      ),
    },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Password', dataIndex: 'password', key: 'password' },
  ];

  return <Table columns={columns} dataSource={data} size="small" pagination={false} />;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const ok = login(values.email, values.password);
      if (!ok) {
        message.error('Invalid credentials');
        return;
      }
      message.success('Signed in successfully');
      navigate('/dashboard', { replace: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: COLORS.lightBg,
        padding: 16,
      }}
    >
      <Card
        style={{
          width: 520,
          borderRadius: 14,
          boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: '50%',
              background: COLORS.brandLightBlue,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 800,
              letterSpacing: 0.5,
            }}
          >
            PRL
          </div>
          <div>
            <Title level={2} style={{ margin: 0, color: COLORS.brandBlue }}>
              HSEQ Portal
            </Title>
            <Text style={{ display: 'block', color: COLORS.grayText }}>Pakistan Refinery Limited</Text>
          </div>
        </div>

        <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ email: '', password: '' }}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please enter email' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="e.g. admin@prl.com.pk" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please enter password' }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{ width: '100%', background: COLORS.brandBlue }}
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>

        <div style={{ marginTop: 14 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Demo Credentials
          </Text>
          <Collapse
            style={{ marginTop: 8 }}
            ghost
            items={[
              {
                key: 'cred',
                label: 'Show users',
                children: (
                  <DemoCredentialsTable
                    onPick={({ email, password, role }) => {
                      form.setFieldsValue({ email, password });
                      message.success(`Filled credentials for ${role}`);
                    }}
                  />
                ),
              },
            ]}
          />
        </div>
      </Card>
    </div>
  );
}


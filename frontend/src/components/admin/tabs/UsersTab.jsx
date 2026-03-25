import React, { useEffect, useMemo, useState } from 'react';
import {
  Avatar,
  Button,
  Input,
  Grid,
  Modal,
  Popconfirm,
  Space,
  Switch,
  Table,
  Tag,
  Typography,
  Form,
  Select,
  message,
} from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';

import { useAuth } from '../../../context/AuthContext.jsx';
import { useAdmin } from '../../../context/AdminContext.jsx';
import { COLORS } from '../../../theme/colors.js';

const { Text } = Typography;

const ROLE_META = {
  super_admin: { label: 'Super Admin', color: '#DC2626' },
  hseq_officer: { label: 'HSEQ Officer', color: '#2E6DB4' },
  focal_person: { label: 'Focal Person', color: '#D97706' },
  employee: { label: 'Employee', color: '#6B7280' },
};

export default function UsersTab() {
  const { currentUser } = useAuth();
  const { users, addUser, deleteUser, updateUser, updateUserStatus, departments } = useAdmin();
  const [search, setSearch] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const screens = Grid.useBreakpoint();
  const widthAdd = screens.md ? 760 : 680;
  const widthEdit = screens.md ? 820 : 720;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => String(u.name).toLowerCase().includes(q) || String(u.email).toLowerCase().includes(q));
  }, [users, search]);

  useEffect(() => {
    if (!editTarget) return;
    editForm.setFieldsValue({
      name: editTarget.name,
      email: editTarget.email,
      password: '',
      role: editTarget.role,
      department: editTarget.department,
      phone: editTarget.phone || '',
      active: editTarget.active ?? true,
    });
  }, [editTarget, editForm]);

  const columns = [
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      key: 'avatar',
      width: 110,
      render: (_, row) => (
        <div>
          <Avatar style={{ background: 'rgba(27,63,123,0.12)', color: COLORS.brandBlue, fontWeight: 800 }}>
            {row.avatar || row.name.split(' ').map((n) => (n[0] ? n[0] : '')).join('').slice(0, 2)}
          </Avatar>
        </div>
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 220,
      render: (value, row) => (
        <Button type="link" onClick={(e) => { e.stopPropagation(); setEditTarget(row); setEditOpen(true); }}>
          {value}
        </Button>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 260,
      render: (value, row) => (
        <Button type="link" onClick={(e) => { e.stopPropagation(); setEditTarget(row); setEditOpen(true); }}>
          {value}
        </Button>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      width: 200,
      render: (_, row) => {
        const meta = ROLE_META[row.role] || { label: row.role, color: COLORS.grayText };
        return (
          <div onClick={(e) => e.stopPropagation()}>
            <Select
              value={row.role}
              onChange={(v) => updateUser(row.id, { role: v }, currentUser)}
              options={Object.entries(ROLE_META).map(([key, v]) => ({ value: key, label: v.label }))}
              style={{ width: '100%' }}
            />
          </div>
        );
      },
    },
    { title: 'Department', dataIndex: 'department', key: 'department', width: 180 },
    { title: 'Phone', dataIndex: 'phone', key: 'phone', width: 200 },
    {
      title: 'Status',
      dataIndex: 'active',
      key: 'active',
      width: 160,
      render: (_, row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Space>
            <Switch
              checked={row.active ?? true}
              onChange={(v) => updateUserStatus(row.id, v, currentUser)}
            />
            <Tag color={row.active ?? true ? COLORS.success : COLORS.danger}>
              {(row.active ?? true) ? 'Active' : 'Inactive'}
            </Tag>
          </Space>
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 180,
      render: (_, row) => {
        const isSelf = row.id === currentUser.id;
        return (
          <Space onClick={(e) => e.stopPropagation()}>
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
              disabled={isSelf}
              onClick={() => {
                // delete handled by Popconfirm
              }}
            />
            <Popconfirm
              title="Are you sure? This user will lose all access."
              okText="Delete"
              cancelText="Cancel"
              onConfirm={() => deleteUser(row.id, currentUser)}
              disabled={isSelf}
            >
              <Button size="small" danger icon={<DeleteOutlined />} disabled={isSelf}>
                Delete
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <div>
          <Text strong style={{ fontSize: 16, color: COLORS.darkText }}>User Management</Text>
          <div style={{ color: COLORS.grayText, fontSize: 12, marginTop: 4 }}>
            Total: <Tag>{users.length}</Tag>
          </div>
        </div>
        <Space>
          <Input placeholder="Search users" value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: 260 }} />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setAddOpen(true)}
            style={{ background: COLORS.brandBlue }}
          >
            + Add User
          </Button>
        </Space>
      </div>

      <div style={{ marginTop: 12 }}>
        <Table
          columns={columns}
          dataSource={filtered}
          rowKey="id"
          size="small"
          bordered
          pagination={false}
          onRow={(row) => ({
            onClick: () => {
              setEditTarget(row);
              setEditOpen(true);
            },
          })}
        />
      </div>

      <Modal
        open={addOpen}
        title="Add User"
        width={widthAdd}
        onCancel={() => setAddOpen(false)}
        footer={null}
        destroyOnClose
        style={{ maxWidth: '95vw' }}
        bodyStyle={{ maxHeight: '75vh', overflow: 'auto' }}
      >
        <Form
          form={addForm}
          layout="vertical"
          onFinish={(vals) => {
            const name = vals.name.trim();
            if (!name) return;
            addUser(
              {
                name,
                email: vals.email.trim(),
                password: vals.password,
                role: vals.role,
                department: vals.department,
                phone: vals.phone || '',
              },
              currentUser
            );
            message.success('User added');
            setAddOpen(false);
            addForm.resetFields();
          }}
        >
          <Form.Item name="name" label="Full Name" rules={[{ required: true, message: 'Name is required' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Valid email required' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Password is required' }]}>
            <Input.Password placeholder="Set demo password" />
          </Form.Item>
          <Form.Item name="role" label="Role" rules={[{ required: true }]}>
            <Select options={Object.entries(ROLE_META).map(([key, v]) => ({ value: key, label: v.label }))} />
          </Form.Item>
          <Form.Item name="department" label="Department" rules={[{ required: true }]}>
            <Select options={[...new Set(users.map((u) => u.department))].map((d) => ({ value: d, label: d }))} />
          </Form.Item>
          <Form.Item name="phone" label="Phone (optional)">
            <Input />
          </Form.Item>

          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ background: COLORS.brandBlue }}>
              Add
            </Button>
          </Space>
        </Form>
      </Modal>

      <Modal
        open={editOpen}
        title={editTarget ? `Edit User: ${editTarget.name}` : 'Edit User'}
        width={widthEdit}
        onCancel={() => setEditOpen(false)}
        footer={null}
        destroyOnClose
        style={{ maxWidth: '95vw' }}
        bodyStyle={{ maxHeight: '75vh', overflow: 'auto' }}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={(vals) => {
            if (!editTarget) return;
            const updates = {
              name: vals.name.trim(),
              email: vals.email.trim(),
              role: vals.role,
              department: vals.department,
              phone: vals.phone || '',
              active: !!vals.active,
            };
            if (vals.password && String(vals.password).trim().length > 0) {
              updates.password = String(vals.password).trim();
            }

            updateUser(editTarget.id, updates, currentUser);
            message.success('User updated');
            setEditOpen(false);
            setEditTarget(null);
          }}
        >
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: 'Name is required' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Email is required' },
              { type: 'email', message: 'Valid email required' },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label='Password (leave blank to keep current)'
          >
            <Input.Password placeholder="Leave blank to keep current" />
          </Form.Item>

          <Form.Item name="role" label="Role" rules={[{ required: true }]}>
            <Select options={Object.entries(ROLE_META).map(([key, v]) => ({ value: key, label: v.label }))} />
          </Form.Item>

          <Form.Item name="department" label="Department" rules={[{ required: true }]}>
            <Select options={(departments || []).map((d) => ({ value: d, label: d }))} />
          </Form.Item>

          <Form.Item name="phone" label="Phone (optional)">
            <Input />
          </Form.Item>

          <Form.Item name="active" label="Status" valuePropName="checked">
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
            <Button onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ background: COLORS.brandBlue }}>
              Save
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}


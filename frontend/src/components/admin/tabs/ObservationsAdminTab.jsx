import React, { useMemo, useState } from 'react';
import {
  Alert,
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from 'antd';
import { DeleteOutlined, EditOutlined, DownloadOutlined, SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

import { useAuth } from '../../../context/AuthContext.jsx';
import { useAdmin } from '../../../context/AdminContext.jsx';
import { ROLE_PERMISSIONS } from '../../../data/mockData.js';
import { COLORS } from '../../../theme/colors.js';
import { exportJsonToExcel } from '../../../utils/excel.js';

const { RangePicker } = DatePicker;
const { Title } = Typography;

function statusTag(status) {
  switch (status) {
    case 'Open':
      return { color: COLORS.accentOrange, text: 'Open' };
    case 'In Progress':
      return { color: COLORS.brandLightBlue, text: 'In Progress' };
    case 'Closed':
      return { color: COLORS.success, text: 'Closed' };
    default:
      return { color: COLORS.grayText, text: status };
  }
}

function priorityColor(priority) {
  const map = {
    Critical: COLORS.danger,
    High: COLORS.accentOrange,
    Medium: COLORS.warning,
    Low: '#6B7280',
  };
  return map[priority] || COLORS.grayText;
}

export default function ObservationsAdminTab() {
  const { currentUser } = useAuth();
  const {
    observations,
    users,
    categories,
    locations,
    departments,
    updateObservation,
    deleteObservation,
    setObservations,
  } = useAdmin();

  const [filters, setFilters] = useState({
    search: '',
    status: 'All',
    category: 'All',
    department: 'All',
    priority: 'All',
    dateRange: null,
  });

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const selectedRows = useMemo(() => {
    const map = new Map(observations.map((o) => [o.id, o]));
    return selectedRowKeys.map((k) => map.get(k)).filter(Boolean);
  }, [selectedRowKeys, observations]);

  const [editOpen, setEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const filtered = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    const [start, end] = filters.dateRange || [];
    const startD = start ? dayjs(start).startOf('day') : null;
    const endD = end ? dayjs(end).endOf('day') : null;

    return observations.filter((o) => {
      if (filters.status !== 'All' && o.status !== filters.status) return false;
      if (filters.category !== 'All' && o.category !== filters.category) return false;
      if (filters.department !== 'All' && o.department !== filters.department) return false;
      if (filters.priority !== 'All' && o.priority !== filters.priority) return false;

      if (startD || endD) {
        const d = dayjs(o.date);
        if (startD && d.isBefore(startD)) return false;
        if (endD && d.isAfter(endD)) return false;
      }

      if (!q) return true;
      return (
        String(o.id).toLowerCase().includes(q) ||
        String(o.description).toLowerCase().includes(q) ||
        String(o.location).toLowerCase().includes(q)
      );
    });
  }, [observations, filters]);

  const exportToExcel = () => {
    const today = new Date().toISOString().split('T')[0];
    const sheets = {
      Observations: filtered.map((o) => ({
        'Observation ID': o.id,
        Date: o.date,
        Location: o.location,
        Department: o.department,
        Category: o.category,
        Status: o.status,
        Priority: o.priority,
        'Assigned To': o.assignedToName,
        'Due Date': o.dueDate,
        'Created By': o.createdByName,
      })),
    };

    exportJsonToExcel(`Observations_${today}.xlsx`, sheets);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 160,
      render: (id) => <Tag color={COLORS.brandLightBlue} style={{ fontFamily: 'monospace' }}>{id}</Tag>,
    },
    { title: 'Date', dataIndex: 'date', key: 'date', width: 120 },
    { title: 'Location', dataIndex: 'location', key: 'location', width: 170 },
    { title: 'Department', dataIndex: 'department', key: 'department', width: 160 },
    { title: 'Category', dataIndex: 'category', key: 'category', width: 160, render: (c) => <Tag color={COLORS.brandBlue}>{c}</Tag> },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 140,
      render: (s) => {
        const t = statusTag(s);
        return <Tag color={t.color}>{t.text}</Tag>;
      },
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      width: 140,
      render: (p) => <Tag color={priorityColor(p)}>{p}</Tag>,
    },
    { title: 'Assigned To', dataIndex: 'assignedToName', key: 'assignedToName', width: 170 },
    { title: 'Due Date', dataIndex: 'dueDate', key: 'dueDate', width: 140 },
    { title: 'Created By', dataIndex: 'createdByName', key: 'createdByName', width: 180 },
    {
      title: 'Actions',
      key: 'actions',
      width: 180,
      render: (_, row) => (
        <Space>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              setEditTarget(row);
              setEditOpen(true);
            }}
          >
            Edit
          </Button>
          <Button
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              setDeleteTarget(row);
              setDeleteConfirmText('');
              setDeleteOpen(true);
            }}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const EditModal = () => {
    const [form] = Form.useForm();

    React.useEffect(() => {
      if (!editTarget) return;
      form.setFieldsValue({
        ...editTarget,
        dueDate: editTarget.dueDate ? dayjs(editTarget.dueDate) : null,
        date: editTarget.date ? dayjs(editTarget.date) : null,
      });
    }, [editTarget, form]);

    const save = (vals) => {
      const due = vals.dueDate ? vals.dueDate.format('YYYY-MM-DD') : editTarget.dueDate;
      const date = vals.date ? vals.date.format('YYYY-MM-DD') : editTarget.date;
      updateObservation(
        editTarget.id,
        {
          ...editTarget,
          date,
          dueDate: due,
          category: vals.category,
          status: vals.status,
          priority: vals.priority,
          location: vals.location,
          department: vals.department,
          assignedTo: vals.assignedTo,
          assignedToName: users.find((u) => u.id === vals.assignedTo)?.name || editTarget.assignedToName,
          description: vals.description,
          correctiveAction: vals.correctiveAction,
        },
        currentUser
      );
      setEditOpen(false);
      setEditTarget(null);
    };

    return (
      <Modal
        open={editOpen}
        title={`Edit ${editTarget?.id || ''}`}
        width={860}
        onCancel={() => setEditOpen(false)}
        footer={null}
        destroyOnClose
        style={{ maxWidth: '95vw' }}
        bodyStyle={{ maxHeight: '75vh', overflow: 'auto' }}
      >
        <Form layout="vertical" form={form} onFinish={save}>
          <Form.Item label="Observation ID">
            <Input value={editTarget?.id} disabled />
          </Form.Item>
          <Form.Item label="Date" name="date" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="Location" name="location" rules={[{ required: true }]}>
            <Select options={locations.map((l) => ({ value: l, label: l }))} />
          </Form.Item>
          <Form.Item label="Department" name="department" rules={[{ required: true }]}>
            <Select options={departments.map((d) => ({ value: d, label: d }))} />
          </Form.Item>
          <Form.Item label="Category" name="category" rules={[{ required: true }]}>
            <Select options={categories.map((c) => ({ value: c, label: c }))} />
          </Form.Item>
          <Form.Item label="Priority" name="priority" rules={[{ required: true }]}>
            <Select options={['Critical', 'High', 'Medium', 'Low'].map((p) => ({ value: p, label: p }))} />
          </Form.Item>
          <Form.Item label="Status" name="status" rules={[{ required: true }]}>
            <Select options={['Open', 'In Progress', 'Closed'].map((s) => ({ value: s, label: s }))} />
          </Form.Item>
          <Form.Item label="Assigned To" name="assignedTo" rules={[{ required: true }]}>
            <Select options={users.map((u) => ({ value: u.id, label: u.name }))} />
          </Form.Item>
          <Form.Item label="Due Date" name="dueDate" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="Description" name="description" rules={[{ required: true }]}>
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item label="Corrective Action" name="correctiveAction" rules={[{ required: true }]}>
            <Input.TextArea rows={3} />
          </Form.Item>
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ background: COLORS.brandBlue }}>
              Save
            </Button>
          </Space>
        </Form>
      </Modal>
    );
  };

  const DeleteModal = () => {
    const confirmId = deleteTarget?.id;
    return (
      <Modal
        open={deleteOpen}
        title={`Delete ${confirmId || ''}`}
        width={640}
        onCancel={() => setDeleteOpen(false)}
        footer={null}
        destroyOnClose
        style={{ maxWidth: '95vw' }}
        bodyStyle={{ maxHeight: '70vh', overflow: 'auto' }}
      >
        <Alert
          type="warning"
          showIcon
          message="This action cannot be undone."
          style={{ borderRadius: 12, marginBottom: 12 }}
        />
        <div style={{ marginBottom: 10, color: COLORS.grayText }}>
          Type the observation ID to confirm deletion:
        </div>
        <Input
          placeholder={`Type ${confirmId}`}
          value={deleteConfirmText}
          onChange={(e) => setDeleteConfirmText(e.target.value)}
        />
        <Space style={{ width: '100%', justifyContent: 'flex-end', marginTop: 16 }}>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button
            danger
            type="primary"
            disabled={deleteConfirmText !== confirmId}
            onClick={() => {
              deleteObservation(confirmId, currentUser);
              setDeleteOpen(false);
              setDeleteTarget(null);
            }}
          >
            Delete Permanently
          </Button>
        </Space>
      </Modal>
    );
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <Title level={3} style={{ margin: 0, color: COLORS.darkText }}>
          All Observations
        </Title>
        <Space>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={exportToExcel}
            style={{ background: COLORS.brandBlue }}
          >
            Export to Excel
          </Button>
        </Space>
      </div>

      <div style={{ marginTop: 12, background: '#fff', borderRadius: 14, padding: 12 }}>
        <Space wrap align="start">
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search across ID, description, or location"
            value={filters.search}
            onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))}
            style={{ width: 320 }}
          />
          <Select
            style={{ width: 160 }}
            value={filters.status}
            onChange={(v) => setFilters((p) => ({ ...p, status: v }))}
            options={[{ value: 'All', label: 'All Statuses' }, 'Open', 'In Progress', 'Closed'].map((s) =>
              typeof s === 'string' ? { value: s, label: s } : s
            )}
          />
          <Select
            style={{ width: 190 }}
            value={filters.category}
            onChange={(v) => setFilters((p) => ({ ...p, category: v }))}
            options={[{ value: 'All', label: 'All Categories' }, ...categories.map((c) => ({ value: c, label: c }))]}
          />
          <Select
            style={{ width: 180 }}
            value={filters.department}
            onChange={(v) => setFilters((p) => ({ ...p, department: v }))}
            options={[{ value: 'All', label: 'All Departments' }, ...departments.map((d) => ({ value: d, label: d }))]}
          />
          <Select
            style={{ width: 160 }}
            value={filters.priority}
            onChange={(v) => setFilters((p) => ({ ...p, priority: v }))}
            options={[
              { value: 'All', label: 'All Priorities' },
              { value: 'Critical', label: 'Critical' },
              { value: 'High', label: 'High' },
              { value: 'Medium', label: 'Medium' },
              { value: 'Low', label: 'Low' },
            ]}
          />
          <RangePicker
            value={filters.dateRange}
            onChange={(v) => setFilters((p) => ({ ...p, dateRange: v }))}
          />
        </Space>
      </div>

      <div style={{ marginTop: 12 }}>
        <Space style={{ marginBottom: 10 }}>
          <Button
            disabled={!selectedRows.length}
            onClick={() => {
              const nextStatus = prompt('Enter new status: Open, In Progress, Closed');
              if (!nextStatus) return;
              for (const row of selectedRows) {
                updateObservation(row.id, { status: nextStatus }, currentUser);
              }
              message.success('Bulk status update complete');
              setSelectedRowKeys([]);
            }}
          >
            Bulk Update Status
          </Button>
          <Button
            disabled={!selectedRows.length}
            onClick={() => {
              const nextAssignee = prompt('Enter assignee name exactly as shown in the dropdown?');
              if (!nextAssignee) return;
              const user = users.find((u) => u.name === nextAssignee);
              if (!user) {
                message.error('Assignee not found');
                return;
              }
              for (const row of selectedRows) {
                updateObservation(row.id, { assignedTo: user.id, assignedToName: user.name }, currentUser);
              }
              message.success('Bulk reassign complete');
              setSelectedRowKeys([]);
            }}
          >
            Bulk Reassign
          </Button>
        </Space>

        <Table
          size="small"
          bordered
          rowKey="id"
          columns={columns}
          dataSource={filtered}
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
          pagination={false}
        />
      </div>

      <EditModal />
      <DeleteModal />
    </div>
  );
}


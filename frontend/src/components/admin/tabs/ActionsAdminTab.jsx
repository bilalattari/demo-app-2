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
  Radio,
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
import { KPI_DATA, DYNAMIC_FORM_FIELDS } from '../../../data/mockData.js';
import { COLORS } from '../../../theme/colors.js';
import { exportJsonToExcel } from '../../../utils/excel.js';

const { RangePicker } = DatePicker;
const { Title } = Typography;

function priorityColor(priority) {
  const map = {
    Critical: COLORS.danger,
    High: COLORS.accentOrange,
    Medium: COLORS.warning,
    Low: '#6B7280',
  };
  return map[priority] || COLORS.grayText;
}

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

function typeColor(type) {
  const item = KPI_DATA.actionsByType.find((t) => t.type === type);
  return item?.color || COLORS.brandLightBlue;
}

export default function ActionsAdminTab() {
  const { currentUser } = useAuth();
  const {
    actionItems,
    users,
    departments,
    formFields,
    updateActionItem,
    deleteActionItem,
  } = useAdmin();

  const [filters, setFilters] = useState({
    search: '',
    activityType: 'All',
    status: 'All',
    department: 'All',
    priority: 'All',
    dateRange: null,
  });

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const selectedRows = useMemo(() => {
    const map = new Map(actionItems.map((a) => [a.id, a]));
    return selectedRowKeys.map((k) => map.get(k)).filter(Boolean);
  }, [selectedRowKeys, actionItems]);

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

    return actionItems.filter((a) => {
      if (filters.activityType !== 'All' && a.activityType !== filters.activityType) return false;
      if (filters.status !== 'All' && a.status !== filters.status) return false;
      if (filters.department !== 'All' && a.department !== filters.department) return false;
      if (filters.priority !== 'All' && a.priority !== filters.priority) return false;

      if (startD || endD) {
        const d = dayjs(a.date);
        if (startD && d.isBefore(startD)) return false;
        if (endD && d.isAfter(endD)) return false;
      }

      if (!q) return true;
      return String(a.title).toLowerCase().includes(q) || String(a.id).toLowerCase().includes(q);
    });
  }, [actionItems, filters]);

  const exportToExcel = () => {
    const today = new Date().toISOString().split('T')[0];
    const sheets = {
      Actions: filtered.map((a) => ({
        'Action ID': a.id,
        Date: a.date,
        'Activity Type': a.activityType,
        Title: a.title,
        Department: a.department,
        Status: a.status,
        Priority: a.priority,
        'Assigned To': a.assignedToName,
        'Due Date': a.dueDate,
        'Created By': a.createdByName,
      })),
    };
    exportJsonToExcel(`Actions_${today}.xlsx`, sheets);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 160,
      render: (id) => <Tag color={COLORS.brandLightBlue} style={{ fontFamily: 'monospace' }}>{id}</Tag>,
    },
    {
      title: 'Activity Type',
      dataIndex: 'activityType',
      key: 'activityType',
      width: 190,
      render: (t) => <Tag color={typeColor(t)}>{t}</Tag>,
    },
    { title: 'Title', dataIndex: 'title', key: 'title', width: 360, ellipsis: true },
    { title: 'Department', dataIndex: 'department', key: 'department', width: 160 },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 160,
      render: (s) => <Tag color={statusTag(s).color}>{statusTag(s).text}</Tag>,
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      width: 150,
      render: (p) => <Tag color={priorityColor(p)}>{p}</Tag>,
    },
    { title: 'Assigned To', dataIndex: 'assignedToName', key: 'assignedToName', width: 180 },
    { title: 'Due Date', dataIndex: 'dueDate', key: 'dueDate', width: 140 },
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
        date: editTarget.date ? dayjs(editTarget.date) : null,
        dueDate: editTarget.dueDate ? dayjs(editTarget.dueDate) : null,
      });
    }, [editTarget, form]);

    const defs = editTarget
      ? formFields?.[editTarget.activityType] || DYNAMIC_FORM_FIELDS?.[editTarget.activityType] || []
      : [];

    const save = (vals) => {
      const due = vals.dueDate ? vals.dueDate.format('YYYY-MM-DD') : editTarget.dueDate;
      const date = vals.date ? vals.date.format('YYYY-MM-DD') : editTarget.date;

      const dynamicUpdates = {};
      for (const d of defs) {
        if (vals.hasOwnProperty(d.key)) {
          dynamicUpdates[d.key] =
            d.type === 'date' && vals[d.key]
              ? vals[d.key].format('YYYY-MM-DD')
              : vals[d.key];
        }
      }

      updateActionItem(
        editTarget.id,
        {
          ...editTarget,
          activityType: vals.activityType,
          title: vals.title,
          department: vals.department,
          assignedTo: vals.assignedTo,
          assignedToName: users.find((u) => u.id === vals.assignedTo)?.name || editTarget.assignedToName,
          dueDate: due,
          status: vals.status,
          priority: vals.priority,
          date,
          ...dynamicUpdates,
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
        width={900}
        onCancel={() => setEditOpen(false)}
        footer={null}
        destroyOnClose
        style={{ maxWidth: '95vw' }}
        bodyStyle={{ maxHeight: '75vh', overflow: 'auto' }}
      >
        <Form layout="vertical" form={form} onFinish={save}>
          <Form.Item label="Action ID">
            <Input value={editTarget?.id} disabled />
          </Form.Item>
          <Form.Item label="Activity Type" name="activityType" rules={[{ required: true }]}>
            <Select
              options={Object.keys(formFields || {}).map((t) => ({ value: t, label: t }))}
            />
          </Form.Item>
          <Form.Item label="Title" name="title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Date" name="date" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="Department" name="department" rules={[{ required: true }]}>
            <Select options={(departments || []).map((d) => ({ value: d, label: d }))} />
          </Form.Item>
          <Form.Item label="Assigned To" name="assignedTo" rules={[{ required: true }]}>
            <Select options={users.map((u) => ({ value: u.id, label: u.name }))} />
          </Form.Item>
          <Form.Item label="Due Date" name="dueDate" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="Priority" name="priority" rules={[{ required: true }]}>
            <Select options={['Critical', 'High', 'Medium', 'Low'].map((p) => ({ value: p, label: p }))} />
          </Form.Item>
          <Form.Item label="Status" name="status" rules={[{ required: true }]}>
            <Select options={['Open', 'In Progress', 'Closed'].map((s) => ({ value: s, label: s }))} />
          </Form.Item>

          {defs.length ? (
            <>
              <div style={{ marginTop: 10, color: COLORS.grayText, fontWeight: 700 }}>
                Activity-specific details
              </div>
              <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {defs.map((d) => (
                  <Form.Item
                    key={d.key}
                    label={d.label}
                    name={d.key}
                    rules={d.required ? [{ required: true }] : []}
                  >
                    {d.type === 'textarea' ? (
                      <Input.TextArea rows={3} />
                    ) : d.type === 'date' ? (
                      <DatePicker style={{ width: '100%' }} />
                    ) : d.type === 'select' ? (
                      <Select options={(d.options || []).map((o) => ({ value: o, label: o }))} />
                    ) : d.type === 'radio' ? (
                      <Radio.Group>
                        {(d.options || []).map((o) => (
                          <Radio key={o} value={o}>
                            {o}
                          </Radio>
                        ))}
                      </Radio.Group>
                    ) : d.type === 'user_select' ? (
                      <Select options={users.map((u) => ({ value: u.name, label: u.name }))} />
                    ) : (
                      <Input />
                    )}
                  </Form.Item>
                ))}
              </div>
            </>
          ) : null}

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
        <Alert type="warning" showIcon message="This action cannot be undone." style={{ borderRadius: 12, marginBottom: 12 }} />
        <div style={{ marginBottom: 10, color: COLORS.grayText }}>
          Type the action ID to confirm deletion:
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
              deleteActionItem(confirmId, currentUser);
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
          All Action Items
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
            placeholder="Search by title or ID"
            value={filters.search}
            onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))}
            style={{ width: 320 }}
          />
          <Select
            style={{ width: 220 }}
            value={filters.activityType}
            onChange={(v) => setFilters((p) => ({ ...p, activityType: v }))}
            options={[{ value: 'All', label: 'All Activity Types' }, ...Object.keys(formFields || {}).map((t) => ({ value: t, label: t }))]}
          />
          <Select
            style={{ width: 180 }}
            value={filters.status}
            onChange={(v) => setFilters((p) => ({ ...p, status: v }))}
            options={[{ value: 'All', label: 'All Statuses' }, 'Open', 'In Progress', 'Closed'].map((s) =>
              typeof s === 'string' ? { value: s, label: s } : s
            )}
          />
          <Select
            style={{ width: 210 }}
            value={filters.department}
            onChange={(v) => setFilters((p) => ({ ...p, department: v }))}
            options={[{ value: 'All', label: 'All Departments' }, ...(departments || []).map((d) => ({ value: d, label: d }))]}
          />
          <Select
            style={{ width: 180 }}
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
          <RangePicker value={filters.dateRange} onChange={(v) => setFilters((p) => ({ ...p, dateRange: v }))} />
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
                updateActionItem(row.id, { status: nextStatus }, currentUser);
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
              const nextAssigneeName = prompt('Enter assignee name (as shown in list):');
              if (!nextAssigneeName) return;
              const user = users.find((u) => u.name === nextAssigneeName);
              if (!user) {
                message.error('Assignee not found');
                return;
              }
              for (const row of selectedRows) {
                updateActionItem(row.id, { assignedTo: user.id, assignedToName: user.name }, currentUser);
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
          rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
          pagination={false}
        />
      </div>

      <EditModal />
      <DeleteModal />
    </div>
  );
}


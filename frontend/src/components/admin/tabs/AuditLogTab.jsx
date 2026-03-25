import React, { useMemo, useState } from 'react';
import { Alert, Button, DatePicker, Input, Select, Space, Table, Tag, Typography, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

import { useAdmin } from '../../../context/AdminContext.jsx';
import { COLORS } from '../../../theme/colors.js';
import { exportJsonToExcel } from '../../../utils/excel.js';

const { RangePicker } = DatePicker;
const { Text } = Typography;

function getActionColor(action) {
  const map = {
    USER: '#7C3AED',
    FORM: '#1B3F7B',
    CATEGORY: '#0891B2',
    LOCATION: 'geekblue',
    DEPT: '#D97706',
    REMINDER: '#E8640A',
    OBSERVATION: '#16A34A',
    ACTION: '#B7E000',
  };

  const prefix = String(action || '')
    .split('_')[0];
  return map[prefix] || COLORS.grayText;
}

export default function AuditLogTab() {
  const { auditLog } = useAdmin();
  const [filters, setFilters] = useState({
    actionType: 'All',
    user: 'All',
    range: null,
  });

  const users = useMemo(() => Array.from(new Set(auditLog.map((l) => l.user))), [auditLog]);
  const actionTypes = useMemo(() => Array.from(new Set(auditLog.map((l) => l.action.split('_')[0]))), [auditLog]);

  const filtered = useMemo(() => {
    const [start, end] = filters.range || [];
    const startD = start ? dayjs(start) : null;
    const endD = end ? dayjs(end) : null;
    return auditLog.filter((e) => {
      if (filters.actionType !== 'All') {
        if (String(e.action).split('_')[0] !== filters.actionType) return false;
      }
      if (filters.user !== 'All' && e.user !== filters.user) return false;
      if (startD || endD) {
        const parsed = dayjs(e.timestamp);
        if (startD && parsed.isBefore(startD)) return false;
        if (endD && parsed.isAfter(endD)) return false;
      }
      return true;
    });
  }, [auditLog, filters]);

  const exportAudit = () => {
    const today = new Date().toISOString().split('T')[0];
    const sheets = {
      'Audit Log': filtered.map((e) => ({
        Timestamp: e.timestamp,
        User: e.user,
        Role: e.role,
        Action: e.action,
        Target: e.target,
        Detail: e.detail,
      })),
    };
    exportJsonToExcel(`AuditLog_${today}.xlsx`, sheets);
    message.success('Audit log exported');
  };

  const columns = [
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 200,
      render: (v) => <span style={{ fontFamily: 'monospace' }}>{v}</span>,
    },
    {
      title: 'User',
      dataIndex: 'user',
      key: 'user',
      width: 200,
      render: (u, row) => (
        <Space>
          <Text>{u}</Text>
          <Tag color={getActionColor(row.action)} style={{ border: 0 }}>
            {row.role}
          </Tag>
        </Space>
      ),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      width: 220,
      render: (a) => <Tag color={getActionColor(a)}>{a}</Tag>,
    },
    { title: 'Target', dataIndex: 'target', key: 'target', width: 220, render: (t) => <b>{t}</b> },
    {
      title: 'Detail',
      dataIndex: 'detail',
      key: 'detail',
      width: 380,
      render: (d) => <span title={d}>{d.length > 80 ? `${d.slice(0, 80)}…` : d}</span>,
    },
  ];

  return (
    <div>
      <Alert
        type="info"
        showIcon
        message="🔒 This log is read-only and cannot be modified. All admin actions are recorded automatically."
        style={{ borderRadius: 12, marginBottom: 12 }}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <div>
          <Text strong style={{ fontSize: 16, color: COLORS.darkText }}>Audit Log</Text>
          <div style={{ color: COLORS.grayText, fontSize: 12, marginTop: 4 }}>
            Total entries: <Tag>{auditLog.length}</Tag>
          </div>
        </div>

        <Button type="primary" icon={<DownloadOutlined />} onClick={exportAudit} style={{ background: COLORS.brandBlue }}>
          Export Audit Log
        </Button>
      </div>

      <div style={{ marginTop: 12, background: '#fff', borderRadius: 14, padding: 12 }}>
        <Space wrap align="start">
          <Select
            style={{ width: 220 }}
            value={filters.actionType}
            onChange={(v) => setFilters((p) => ({ ...p, actionType: v }))}
            options={[{ value: 'All', label: 'All action types' }, ...actionTypes.map((t) => ({ value: t, label: t }))]}
          />
          <Select
            style={{ width: 220 }}
            value={filters.user}
            onChange={(v) => setFilters((p) => ({ ...p, user: v }))}
            options={[{ value: 'All', label: 'All users' }, ...users.map((u) => ({ value: u, label: u }))]}
          />
          <RangePicker value={filters.range} onChange={(v) => setFilters((p) => ({ ...p, range: v }))} />
        </Space>
      </div>

      <div style={{ marginTop: 12 }}>
        <Table
          size="small"
          bordered
          rowKey="id"
          columns={columns}
          dataSource={filtered}
          pagination={false}
        />
      </div>
    </div>
  );
}


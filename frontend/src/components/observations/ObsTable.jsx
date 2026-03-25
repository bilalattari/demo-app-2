import React from 'react';
import { Button, Tag, Table, Typography } from 'antd';
import { EyeOutlined } from '@ant-design/icons';

import { COLORS } from '../../theme/colors.js';
import { daysOverdue } from '../../utils/demoClock.js';

const { Text } = Typography;

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

function priorityTag(priority) {
  const map = {
    Critical: COLORS.danger,
    High: COLORS.accentOrange,
    Medium: COLORS.warning,
    Low: '#6B7280',
  };
  return map[priority] || COLORS.grayText;
}

export default function ObsTable({ observations, onView }) {
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 160,
      render: (id) => (
        <Tag color={COLORS.brandLightBlue} style={{ fontFamily: 'monospace' }}>
          {id}
        </Tag>
      ),
    },
    { title: 'Date', dataIndex: 'date', key: 'date', width: 120 },
    { title: 'Location', dataIndex: 'location', key: 'location', width: 160 },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 160,
      render: (cat) => <Tag color={COLORS.brandBlue}>{cat}</Tag>,
    },
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
      render: (p) => <Tag color={priorityTag(p)}>{p}</Tag>,
    },
    {
      title: 'Assigned To',
      dataIndex: 'assignedToName',
      key: 'assignedToName',
      width: 180,
      render: (v) => (
        <div
          style={{
            maxWidth: 160,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
          title={v}
        >
          {v}
        </div>
      ),
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      width: 140,
      render: (d, row) => (
        <span style={{ color: daysOverdue(row.dueDate) > 0 ? COLORS.danger : COLORS.darkText, fontWeight: 600 }}>
          {d}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, row) => (
        <Button type="link" icon={<EyeOutlined />} onClick={(e) => { e.stopPropagation(); onView(row); }}>
          View
        </Button>
      ),
    },
  ];

  const scrollX = 1200;

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <Table
        size="small"
        bordered
        rowKey="id"
        columns={columns}
        dataSource={observations}
        onRow={(row) => ({
          onClick: () => onView(row),
        })}
        pagination={false}
        scroll={{ x: scrollX }}
        style={{ minWidth: scrollX }}
      />
    </div>
  );
}


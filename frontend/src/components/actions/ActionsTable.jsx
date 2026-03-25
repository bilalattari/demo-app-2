import React from 'react';
import { Button, Tag, Table } from 'antd';
import { EyeOutlined } from '@ant-design/icons';

import { KPI_DATA } from '../../data/mockData';
import { COLORS } from '../../theme/colors.js';
import { daysOverdue } from '../../utils/demoClock.js';

function priorityTag(priority) {
  const map = {
    Critical: COLORS.danger,
    High: COLORS.accentOrange,
    Medium: COLORS.warning,
    Low: '#6B7280',
  };
  return map[priority] || COLORS.grayText;
}

function typeColor(type) {
  const item = KPI_DATA.actionsByType.find((t) => t.type === type);
  return item?.color || COLORS.brandLightBlue;
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

export default function ActionsTable({ actionItems, onView }) {
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
      render: (s) => {
        const t = statusTag(s);
        return <Tag color={t.color}>{t.text}</Tag>;
      },
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      width: 150,
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
        <span
          style={{
            color: daysOverdue(row.dueDate) > 0 ? COLORS.danger : undefined,
            fontWeight: 600,
          }}
        >
          {d}
        </span>
      ),
    },
    {
      title: 'View',
      key: 'view',
      width: 110,
      render: (_, row) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            onView(row);
          }}
        >
          View
        </Button>
      ),
    },
  ];

  const scrollX = 1600;

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <Table
        size="small"
        bordered
        rowKey="id"
        columns={columns}
        dataSource={actionItems}
        pagination={false}
        onRow={(row) => ({
          onClick: () => onView(row),
        })}
        scroll={{ x: scrollX }}
        style={{ minWidth: scrollX }}
      />
    </div>
  );
}


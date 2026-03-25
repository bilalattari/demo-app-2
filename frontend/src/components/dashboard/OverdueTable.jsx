import React from 'react';
import { Table, Tag, Typography } from 'antd';
import { KPI_DATA } from '../../data/mockData';
import { COLORS } from '../../theme/colors.js';

const { Title } = Typography;

function priorityColor(p) {
  const map = {
    Critical: COLORS.danger,
    High: COLORS.accentOrange,
    Medium: '#F59E0B',
    Low: '#6B7280',
  };
  return map[p] || COLORS.grayText;
}

export default function OverdueTable() {
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 150,
      render: (id) => <Tag color={COLORS.brandLightBlue} style={{ fontFamily: 'monospace' }}>{id}</Tag>,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 170,
      render: (t) => (
        <Tag color={t === 'Observation' ? COLORS.accentOrange : COLORS.danger}>
          {t}
        </Tag>
      ),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: 280,
      render: (v) => (
        <div
          style={{
            maxWidth: 260,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            fontWeight: 500,
          }}
          title={v}
        >
          {v}
        </div>
      ),
    },
    {
      title: 'Assigned To',
      dataIndex: 'assignedTo',
      key: 'assignedTo',
      width: 170,
      render: (v) => (
        <div
          style={{
            maxWidth: 150,
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
      width: 150,
      render: (d, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Tag color={row.daysOverdue > 0 ? COLORS.danger : 'default'} style={{ borderRadius: 8 }}>
            {d}
          </Tag>
        </div>
      ),
    },
    {
      title: 'Days Overdue',
      dataIndex: 'daysOverdue',
      key: 'daysOverdue',
      width: 170,
      render: (days) =>
        days > 0 ? <Tag color={COLORS.danger}>{days} days</Tag> : <Tag style={{ borderRadius: 8 }}>On Track</Tag>,
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      width: 140,
      render: (p) => <Tag color={priorityColor(p)} style={{ borderRadius: 8 }}>{p}</Tag>,
    },
  ];

  return (
    <div>
      <Title level={4} style={{ margin: '0 0 10px', color: COLORS.darkText }}>
        Overdue Items
      </Title>
      <div style={{ width: '100%', overflowX: 'auto' }}>
        <Table
          columns={columns}
          dataSource={KPI_DATA.overdueItems}
          rowKey="id"
          size="small"
          bordered
          pagination={false}
          scroll={{ x: 980 }}
          style={{ minWidth: 980 }}
        />
      </div>
    </div>
  );
}


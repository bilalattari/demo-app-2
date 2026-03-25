import React, { useMemo, useState } from 'react';
import { Button, Card, Input, Select, Space, Tag, Typography } from 'antd';

import { useAuth } from '../../context/AuthContext.jsx';
import { useAdmin } from '../../context/AdminContext.jsx';
import { ROLE_PERMISSIONS, KPI_DATA } from '../../data/mockData.js';
import { COLORS } from '../../theme/colors.js';

import ActionsTable from './ActionsTable.jsx';
import NewActionModal from './NewActionModal.jsx';
import ActionDetailModal from './ActionDetailModal.jsx';

const { Title } = Typography;

export default function ActionsPage() {
  const { currentUser } = useAuth();
  const perm = ROLE_PERMISSIONS[currentUser?.role] || {};
  const { actionItems, departments } = useAdmin();

  const [filters, setFilters] = useState({
    activityType: 'All',
    status: 'All',
    department: 'All',
    priority: 'All',
    search: '',
  });

  const [newOpen, setNewOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    return actionItems.filter((a) => {
      if (filters.activityType !== 'All' && a.activityType !== filters.activityType) return false;
      if (filters.status !== 'All' && a.status !== filters.status) return false;
      if (filters.department !== 'All' && a.department !== filters.department) return false;
      if (filters.priority !== 'All' && a.priority !== filters.priority) return false;
      if (!q) return true;
      return (
        String(a.id).toLowerCase().includes(q) ||
        String(a.title).toLowerCase().includes(q) ||
        String(a.assignedToName).toLowerCase().includes(q)
      );
    });
  }, [actionItems, filters]);

  const activityTypes = useMemo(() => KPI_DATA.actionsByType.map((t) => t.type), []);

  return (
    <div>
      <Space direction="vertical" size={12} style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
          <div>
            <Title level={3} style={{ margin: 0, color: COLORS.darkText }}>
              Action Items
            </Title>
            <div style={{ color: COLORS.grayText, fontSize: 12, marginTop: 4 }}>
              Total: <Tag>{actionItems.length}</Tag>
            </div>
          </div>
          {perm.canCreate ? (
            <Button
              type="primary"
              onClick={() => setNewOpen(true)}
              style={{ background: COLORS.brandBlue, borderColor: COLORS.brandBlue }}
            >
              New Action
            </Button>
          ) : null}
        </div>

        <Card bordered={false} style={{ background: '#fff' }}>
          <Space wrap align="start">
            <Select
              style={{ width: 220 }}
              value={filters.activityType}
              onChange={(v) => setFilters((p) => ({ ...p, activityType: v }))}
              options={[{ value: 'All', label: 'All Activity Types' }, ...activityTypes.map((t) => ({ value: t, label: t }))]}
            />
            <Select
              style={{ width: 180 }}
              value={filters.status}
              onChange={(v) => setFilters((p) => ({ ...p, status: v }))}
              options={[{ value: 'All', label: 'All Statuses' }, 'Open', 'In Progress', 'Closed'].map((s) =>
                typeof s === 'string' ? { value: s, label: s } : s
              )}
              allowClear={false}
            />
            <Select
              style={{ width: 220 }}
              value={filters.department}
              onChange={(v) => setFilters((p) => ({ ...p, department: v }))}
              options={[{ value: 'All', label: 'All Departments' }, ...(departments || []).map((d) => ({ value: d, label: d }))]}
              allowClear={false}
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
              allowClear={false}
            />
            <Input
              style={{ width: 260 }}
              placeholder="Search by ID, title, or assigned person"
              value={filters.search}
              onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))}
            />
          </Space>

          <div style={{ marginTop: 14 }}>
            <ActionsTable
              actionItems={filtered}
              onView={(row) => {
                setSelected(row);
                setDetailOpen(true);
              }}
            />
          </div>
        </Card>
      </Space>

      <NewActionModal open={newOpen} onClose={() => setNewOpen(false)} />
      <ActionDetailModal open={detailOpen} action={selected} onClose={() => setDetailOpen(false)} />
    </div>
  );
}


import React, { useMemo, useState } from 'react';
import { Button, Card, Input, Select, Space, Tag, Typography, message } from 'antd';
import dayjs from 'dayjs';

import { useAuth } from '../../context/AuthContext.jsx';
import { useAdmin } from '../../context/AdminContext.jsx';
import { ROLE_PERMISSIONS } from '../../data/mockData.js';
import { COLORS } from '../../theme/colors.js';

import ObsTable from './ObsTable.jsx';
import NewObsModal from './NewObsModal.jsx';
import ObsDetailModal from './ObsDetailModal.jsx';

const { Title } = Typography;

export default function ObservationsPage() {
  const { currentUser } = useAuth();
  const perm = ROLE_PERMISSIONS[currentUser?.role] || {};
  const { observations, categories, departments, users } = useAdmin();

  const [filters, setFilters] = useState({
    status: 'All',
    category: 'All',
    department: 'All',
    search: '',
  });

  const [newOpen, setNewOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    return observations.filter((o) => {
      if (filters.status !== 'All' && o.status !== filters.status) return false;
      if (filters.category !== 'All' && o.category !== filters.category) return false;
      if (filters.department !== 'All' && o.department !== filters.department) return false;
      if (!q) return true;
      return (
        String(o.id).toLowerCase().includes(q) ||
        String(o.description).toLowerCase().includes(q) ||
        String(o.location).toLowerCase().includes(q)
      );
    });
  }, [observations, filters]);

  const statusOptions = ['All', 'Open', 'In Progress', 'Closed'];

  return (
    <div>
      <Space direction="vertical" size={12} style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
          <div>
            <Title level={3} style={{ margin: 0, color: COLORS.darkText }}>
              Observations
            </Title>
            <div style={{ color: COLORS.grayText, fontSize: 12, marginTop: 4 }}>
              Total: <Tag>{observations.length}</Tag>
            </div>
          </div>
          {perm.canCreate ? (
            <Button
              type="primary"
              onClick={() => setNewOpen(true)}
              style={{ background: COLORS.brandBlue, borderColor: COLORS.brandBlue }}
            >
              New Observation
            </Button>
          ) : null}
        </div>

        <Card bordered={false} style={{ background: '#fff' }}>
          <Space wrap align="start">
            <Select
              style={{ width: 180 }}
              value={filters.status}
              onChange={(v) => setFilters((p) => ({ ...p, status: v }))}
              options={statusOptions.map((s) => ({ value: s, label: s }))}
            />
            <Select
              style={{ width: 220 }}
              value={filters.category}
              onChange={(v) => setFilters((p) => ({ ...p, category: v }))}
              options={[{ value: 'All', label: 'All Categories' }, ...categories.map((c) => ({ value: c, label: c }))]}
              allowClear={false}
            />
            <Select
              style={{ width: 220 }}
              value={filters.department}
              onChange={(v) => setFilters((p) => ({ ...p, department: v }))}
              options={[{ value: 'All', label: 'All Departments' }, ...departments.map((d) => ({ value: d, label: d }))]}
              allowClear={false}
            />
            <Input
              style={{ width: 260 }}
              placeholder="Search by ID, description, or location"
              value={filters.search}
              onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))}
            />
          </Space>

          <div style={{ marginTop: 14 }}>
            <ObsTable
              observations={filtered}
              onView={(row) => {
                setSelected(row);
                setDetailOpen(true);
              }}
            />
          </div>
        </Card>
      </Space>

      <NewObsModal
        open={newOpen}
        onClose={() => setNewOpen(false)}
      />

      <ObsDetailModal
        open={detailOpen}
        observation={selected}
        onClose={() => setDetailOpen(false)}
      />
    </div>
  );
}


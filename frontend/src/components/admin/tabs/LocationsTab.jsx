import React, { useMemo, useState } from 'react';
import { Alert, Button, Card, Input, Popconfirm, Space, Tag, Typography } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

import { useAuth } from '../../../context/AuthContext.jsx';
import { useAdmin } from '../../../context/AdminContext.jsx';
import { COLORS } from '../../../theme/colors.js';

const { Text } = Typography;

export default function LocationsTab() {
  const { currentUser } = useAuth();
  const {
    locations,
    departments,
    addLocation,
    updateLocation,
    deleteLocation,
    addDepartment,
    updateDepartment,
    deleteDepartment,
  } = useAdmin();

  const [locSearch, setLocSearch] = useState('');
  const [deptSearch, setDeptSearch] = useState('');

  const [newLoc, setNewLoc] = useState('');
  const [newDept, setNewDept] = useState('');

  const [editingLoc, setEditingLoc] = useState(null);
  const [editingLocValue, setEditingLocValue] = useState('');

  const [editingDept, setEditingDept] = useState(null);
  const [editingDeptValue, setEditingDeptValue] = useState('');

  const filteredLocations = useMemo(() => {
    const q = locSearch.trim().toLowerCase();
    return q ? locations.filter((l) => l.toLowerCase().includes(q)) : locations;
  }, [locations, locSearch]);

  const filteredDepartments = useMemo(() => {
    const q = deptSearch.trim().toLowerCase();
    return q ? departments.filter((d) => d.toLowerCase().includes(q)) : departments;
  }, [departments, deptSearch]);

  return (
    <div>
      <Alert
        type="info"
        showIcon
        message="Changes here are reflected immediately in all observation and action item forms."
        style={{ borderRadius: 12, marginBottom: 14 }}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card bordered={false} style={{ background: '#fff', borderRadius: 14 }}>
          <Text strong style={{ color: COLORS.darkText }}>Facility Locations</Text>
          <div style={{ color: COLORS.grayText, fontSize: 12, marginTop: 4 }}>
            Total: <Tag>{locations.length}</Tag>
          </div>
          <div style={{ marginTop: 10 }}>
            <Input placeholder="Search locations" value={locSearch} onChange={(e) => setLocSearch(e.target.value)} />
          </div>

          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 380, overflow: 'auto' }}>
            {filteredLocations.map((l) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                {editingLoc === l ? (
                  <Space>
                    <Input
                      size="small"
                      style={{ width: 240 }}
                      value={editingLocValue}
                      onChange={(e) => setEditingLocValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const v = editingLocValue.trim();
                          if (!v) return;
                          updateLocation(l, v, currentUser);
                          setEditingLoc(null);
                        }
                      }}
                    />
                    <Button size="small" onClick={() => setEditingLoc(null)}>Cancel</Button>
                  </Space>
                ) : (
                  <Tag color={COLORS.brandBlue} style={{ borderRadius: 999, padding: '6px 10px' }}>
                    {l}
                  </Tag>
                )}

                {editingLoc === l ? null : (
                  <Space>
                    <EditOutlined
                      style={{ cursor: 'pointer', color: COLORS.brandBlue }}
                      onClick={() => {
                        setEditingLoc(l);
                        setEditingLocValue(l);
                      }}
                    />
                    <Popconfirm
                      title={`Delete location "${l}"?`}
                      okText="Delete"
                      cancelText="Cancel"
                      onConfirm={() => deleteLocation(l, currentUser)}
                    >
                      <DeleteOutlined style={{ cursor: 'pointer', color: COLORS.danger }} />
                    </Popconfirm>
                  </Space>
                )}
              </div>
            ))}
          </div>

          <div style={{ marginTop: 14, display: 'flex', gap: 10 }}>
            <Input value={newLoc} onChange={(e) => setNewLoc(e.target.value)} placeholder="Add location" />
            <Button
              type="primary"
              style={{ background: COLORS.brandBlue }}
              onClick={() => {
                const v = newLoc.trim();
                if (!v) return;
                addLocation(v, currentUser);
                setNewLoc('');
              }}
            >
              + Add
            </Button>
          </div>
        </Card>

        <Card bordered={false} style={{ background: '#fff', borderRadius: 14 }}>
          <Text strong style={{ color: COLORS.darkText }}>Departments</Text>
          <div style={{ color: COLORS.grayText, fontSize: 12, marginTop: 4 }}>
            Total: <Tag>{departments.length}</Tag>
          </div>
          <div style={{ marginTop: 10 }}>
            <Input placeholder="Search departments" value={deptSearch} onChange={(e) => setDeptSearch(e.target.value)} />
          </div>

          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 380, overflow: 'auto' }}>
            {filteredDepartments.map((d) => (
              <div key={d} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                {editingDept === d ? (
                  <Space>
                    <Input
                      size="small"
                      style={{ width: 240 }}
                      value={editingDeptValue}
                      onChange={(e) => setEditingDeptValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const v = editingDeptValue.trim();
                          if (!v) return;
                          updateDepartment(d, v, currentUser);
                          setEditingDept(null);
                        }
                      }}
                    />
                    <Button size="small" onClick={() => setEditingDept(null)}>Cancel</Button>
                  </Space>
                ) : (
                  <Tag color={COLORS.brandBlue} style={{ borderRadius: 999, padding: '6px 10px' }}>
                    {d}
                  </Tag>
                )}

                {editingDept === d ? null : (
                  <Space>
                    <EditOutlined
                      style={{ cursor: 'pointer', color: COLORS.brandBlue }}
                      onClick={() => {
                        setEditingDept(d);
                        setEditingDeptValue(d);
                      }}
                    />
                    <Popconfirm
                      title={`Delete department "${d}"?`}
                      okText="Delete"
                      cancelText="Cancel"
                      onConfirm={() => deleteDepartment(d, currentUser)}
                    >
                      <DeleteOutlined style={{ cursor: 'pointer', color: COLORS.danger }} />
                    </Popconfirm>
                  </Space>
                )}
              </div>
            ))}
          </div>

          <div style={{ marginTop: 14, display: 'flex', gap: 10 }}>
            <Input value={newDept} onChange={(e) => setNewDept(e.target.value)} placeholder="Add department" />
            <Button
              type="primary"
              style={{ background: COLORS.brandBlue }}
              onClick={() => {
                const v = newDept.trim();
                if (!v) return;
                addDepartment(v, currentUser);
                setNewDept('');
              }}
            >
              + Add
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}


import React, { useMemo, useState } from 'react';
import { Alert, Button, Card, Input, Popconfirm, Space, Tag, Typography } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

import { useAuth } from '../../../context/AuthContext.jsx';
import { useAdmin } from '../../../context/AdminContext.jsx';
import { COLORS } from '../../../theme/colors.js';
import { ACTION_ACTIVITY_TYPES } from '../../../data/mockData.js';

const { Text } = Typography;

export default function CategoriesTab() {
  const { currentUser } = useAuth();
  const { categories, addCategory, updateCategory, deleteCategory } = useAdmin();

  const [newCat, setNewCat] = useState('');
  const [editing, setEditing] = useState(null);
  const [editingValue, setEditingValue] = useState('');

  const activityTypes = useMemo(() => ACTION_ACTIVITY_TYPES, []);

  const canSave = (v) => v.trim().length > 0 && !categories.includes(v.trim());

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <Text strong style={{ fontSize: 16, color: COLORS.darkText }}>Observation Categories</Text>
        <Text type="secondary" style={{ fontSize: 12 }}>
          Changes update the Observation form instantly.
        </Text>
      </div>

      <div style={{ marginTop: 12, marginBottom: 12 }}>
        <Alert
          type="info"
          showIcon
          message="Your added categories are immediately available in all observation forms."
          style={{ borderRadius: 12 }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card bordered={false} style={{ background: '#fff', borderRadius: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <Text strong>Categories</Text>
            <Button type="primary" style={{ background: COLORS.brandBlue }} onClick={() => {}}>
              Manage
            </Button>
          </div>

          <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {categories.map((c) => (
              <Tag
                key={c}
                color={COLORS.brandBlue}
                style={{ borderRadius: 999, padding: '6px 10px' }}
              >
                {editing === c ? (
                  <Input
                    size="small"
                    style={{ width: 160 }}
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        if (!canSave(editingValue)) return;
                        updateCategory(c, editingValue.trim(), currentUser);
                        setEditing(null);
                      }
                    }}
                  />
                ) : (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    {c}
                    <EditOutlined
                      style={{ cursor: 'pointer', color: '#fff', opacity: 0.9 }}
                      onClick={() => {
                        setEditing(c);
                        setEditingValue(c);
                      }}
                    />
                    <Popconfirm
                      title={`Delete "${c}"? Existing observations will keep the old value.`}
                      okText="Delete"
                      cancelText="Cancel"
                      onConfirm={() => deleteCategory(c, currentUser)}
                    >
                      <DeleteOutlined style={{ cursor: 'pointer', color: '#fff', opacity: 0.9 }} />
                    </Popconfirm>
                  </span>
                )}
              </Tag>
            ))}
          </div>

          <div style={{ marginTop: 14, display: 'flex', gap: 10 }}>
            <Input
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
              placeholder="Add a new category"
            />
            <Button
              type="primary"
              style={{ background: COLORS.brandBlue }}
              onClick={() => {
                const v = newCat.trim();
                if (!v) return;
                if (categories.includes(v)) return;
                addCategory(v, currentUser);
                setNewCat('');
              }}
            >
              + Add
            </Button>
          </div>
        </Card>

        <Card bordered={false} style={{ background: '#fff', borderRadius: 14 }}>
          <Text strong>Action Activity Types (System)</Text>
          <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {activityTypes.map((t) => (
              <Tag key={t} color="default">
                {t}
              </Tag>
            ))}
          </div>
          <div style={{ marginTop: 12 }}>
            <Alert
              type="warning"
              showIcon
              message="Activity types are system-defined and cannot be modified."
              style={{ borderRadius: 12 }}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}


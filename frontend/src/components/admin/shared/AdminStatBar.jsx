import React from 'react';
import { Card, Tag, Typography } from 'antd';
import { COLORS } from '../../../theme/colors.js';
import { useAdmin } from '../../../context/AdminContext.jsx';

const { Text } = Typography;

export default function AdminStatBar() {
  const { users, observations, actionItems, auditLog } = useAdmin();

  const stats = [
    { label: 'Total Users', value: users.length, color: COLORS.brandBlue },
    { label: 'Total Observations', value: observations.length, color: COLORS.accentOrange },
    { label: 'Total Action Items', value: actionItems.length, color: COLORS.success },
    { label: 'Audit Log Entries', value: auditLog.length, color: COLORS.warning },
  ];

  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      {stats.map((s) => (
        <Card
          key={s.label}
          size="small"
          style={{
            borderRadius: 12,
            minWidth: 220,
            borderTop: `4px solid ${s.color}`,
            boxShadow: '0 1px 8px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <Text style={{ fontWeight: 800, fontSize: 20, color: COLORS.darkText }}>{s.value}</Text>
            <Tag color={s.color} style={{ border: 0 }}>
              {s.label}
            </Tag>
          </div>
        </Card>
      ))}
    </div>
  );
}


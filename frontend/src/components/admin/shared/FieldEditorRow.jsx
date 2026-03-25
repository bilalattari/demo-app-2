import React from 'react';
import { Button, Card, Space, Tag, Typography } from 'antd';
import { DeleteOutlined, EditOutlined, UpOutlined, DownOutlined } from '@ant-design/icons';

import { COLORS } from '../../../theme/colors.js';

const { Text } = Typography;

function typeBadgeColor(type) {
  switch (type) {
    case 'textarea':
      return '#2E6DB4';
    case 'select':
      return '#16A34A';
    case 'date':
      return '#F59E0B';
    case 'radio':
      return '#7C3AED';
    case 'user_select':
      return COLORS.brandBlue;
    case 'text':
    default:
      return '#6B7280';
  }
}

export default function FieldEditorRow({
  field,
  index,
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
  onEdit,
  onDelete,
}) {
  return (
    <Card
      size="small"
      style={{
        borderRadius: 12,
        background: '#fff',
        border: '1px solid rgba(0,0,0,0.06)',
      }}
      bodyStyle={{ padding: 12 }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <Text strong>{field.label}</Text>
            <Tag color={typeBadgeColor(field.type)}>{field.type}</Tag>
            {field.required ? <Tag color={COLORS.danger}>Required</Tag> : null}
            {field.conditional ? (
              <Tag color={COLORS.brandLightBlue}>
                Conditional on: {field.conditional.field} = {field.conditional.value}
              </Tag>
            ) : null}
          </div>
          <div style={{ marginTop: 8, color: '#6B7280', fontSize: 12 }}>Key: {field.key}</div>
        </div>

        <Space>
          <Button size="small" icon={<UpOutlined />} disabled={!canMoveUp} onClick={onMoveUp} />
          <Button size="small" icon={<DownOutlined />} disabled={!canMoveDown} onClick={onMoveDown} />
          <Button size="small" icon={<EditOutlined />} onClick={onEdit} />
          <Button size="small" danger icon={<DeleteOutlined />} onClick={onDelete} />
        </Space>
      </div>
    </Card>
  );
}


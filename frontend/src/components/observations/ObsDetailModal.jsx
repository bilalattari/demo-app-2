import React, { useMemo } from 'react';
import { Button, Descriptions, Grid, Modal, Space, Tag, Typography, message } from 'antd';
import { CheckCircleOutlined, MailOutlined, WarningOutlined } from '@ant-design/icons';

import { useAuth } from '../../context/AuthContext.jsx';
import { useAdmin } from '../../context/AdminContext.jsx';
import { ROLE_PERMISSIONS } from '../../data/mockData.js';
import { COLORS } from '../../theme/colors.js';
import { DEMO_NOW, isOverdue, daysOverdue } from '../../utils/demoClock.js';

const { Text } = Typography;

function priorityTag(priority) {
  const map = {
    Critical: COLORS.danger,
    High: COLORS.accentOrange,
    Medium: COLORS.warning,
    Low: '#6B7280',
  };
  return map[priority] || COLORS.grayText;
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

export default function ObsDetailModal({ open, observation, onClose }) {
  const { currentUser } = useAuth();
  const { users, setObservations } = useAdmin();

  const perm = ROLE_PERMISSIONS[currentUser?.role] || {};
  const screens = Grid.useBreakpoint();
  const width = screens.md ? 700 : 620;

  const ccNames = useMemo(() => {
    const ccIds = observation?.cc || [];
    return ccIds.map((id) => users.find((u) => u.id === id)?.name).filter(Boolean);
  }, [observation, users]);

  const sTag = observation ? statusTag(observation.status) : null;
  const isItemOverdue = observation ? isOverdue(observation.dueDate) : false;

  const handleSendReminder = () => {
    if (!observation) return;
    setObservations((prev) =>
      prev.map((o) => (o.id === observation.id ? { ...o, reminderSent: true } : o))
    );
    message.success(`Reminder sent to ${observation.assignedToName}`);
  };

  const handleCloseAsDone = () => {
    if (!observation) return;
    const closedDate = DEMO_NOW.format('YYYY-MM-DD');
    setObservations((prev) =>
      prev.map((o) =>
        o.id === observation.id
          ? { ...o, status: 'Closed', closedDate, reminderSent: o.reminderSent }
          : o
      )
    );
  };

  return (
    <Modal
      open={open}
      title={
        observation ? (
          <Space wrap>
            <span style={{ fontFamily: 'monospace', fontWeight: 800 }}>{observation.id}</span>
            {sTag && <Tag color={sTag.color}>{sTag.text}</Tag>}
            <Tag color={priorityTag(observation.priority)}>{observation.priority}</Tag>
            {observation.reminderSent ? <Tag color={COLORS.accentOrange}>Reminder Sent</Tag> : null}
          </Space>
        ) : (
          'Observation'
        )
      }
      onCancel={onClose}
      footer={null}
      width={width}
      style={{ maxWidth: '95vw' }}
      bodyStyle={{ maxHeight: '70vh', overflow: 'auto' }}
    >
      {!observation ? null : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Descriptions bordered column={2} size="small">
            <Descriptions.Item label="Date">{observation.date}</Descriptions.Item>
            <Descriptions.Item label="Location">{observation.location}</Descriptions.Item>
            <Descriptions.Item label="Department">{observation.department}</Descriptions.Item>
            <Descriptions.Item label="Category">{observation.category}</Descriptions.Item>
          </Descriptions>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
            <div>
              <Text strong>Description</Text>
              <div
                style={{
                  marginTop: 6,
                  background: '#fff',
                  padding: 12,
                  border: '1px solid rgba(0,0,0,0.06)',
                  borderRadius: 8,
                }}
              >
                {observation.description}
              </div>
            </div>

            <div>
              <Text strong>Corrective Action</Text>
              <div
                style={{
                  marginTop: 6,
                  background: '#fff',
                  padding: 12,
                  border: '1px solid rgba(0,0,0,0.06)',
                  borderRadius: 8,
                }}
              >
                {observation.correctiveAction}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <Text strong>Assigned To</Text>
              <div style={{ marginTop: 6, color: COLORS.darkText }}>{observation.assignedToName}</div>
              <Text strong style={{ display: 'block', marginTop: 10 }}>
                CC
              </Text>
              <div style={{ marginTop: 6, color: COLORS.darkText }}>
                {ccNames.length ? ccNames.join(', ') : '—'}
              </div>
            </div>

            <div>
              <Text strong>Due Date</Text>
              <div style={{ marginTop: 6 }}>
                <span style={{ color: isItemOverdue ? COLORS.danger : COLORS.darkText, fontWeight: 700 }}>
                  {observation.dueDate}
                </span>
                {isItemOverdue ? (
                  <Tag color={COLORS.danger} style={{ marginLeft: 10 }}>
                    <WarningOutlined /> {daysOverdue(observation.dueDate)} days overdue
                  </Tag>
                ) : (
                  <Tag style={{ marginLeft: 10 }}>On Track</Tag>
                )}
              </div>
            </div>
          </div>

          {Array.isArray(observation.evidence) && observation.evidence.length ? (
            <div>
              <Text strong>Evidence (visual only)</Text>
              <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {observation.evidence.map((f) => (
                  <Tag key={f}>{f}</Tag>
                ))}
              </div>
            </div>
          ) : null}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
            <Space>
              {perm.canAssign && observation.status !== 'Closed' ? (
                <Button type="primary" icon={<MailOutlined />} onClick={handleSendReminder}>
                  Send Reminder
                </Button>
              ) : null}
              {perm.canClose && observation.status !== 'Closed' ? (
                <Button
                  icon={<CheckCircleOutlined />}
                  style={{ background: COLORS.success, borderColor: COLORS.success, color: '#fff' }}
                  onClick={handleCloseAsDone}
                >
                  Mark as Closed
                </Button>
              ) : null}
            </Space>
            <Button onClick={onClose}>Close Modal</Button>
          </div>
        </div>
      )}
    </Modal>
  );
}


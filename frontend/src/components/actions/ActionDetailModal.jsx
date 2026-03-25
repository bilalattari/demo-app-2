import React, { useMemo } from 'react';
import { Button, Descriptions, Grid, Modal, Space, Tag, Typography, message } from 'antd';
import { CheckCircleOutlined, MailOutlined, WarningOutlined } from '@ant-design/icons';

import { useAuth } from '../../context/AuthContext.jsx';
import { useAdmin } from '../../context/AdminContext.jsx';
import { ROLE_PERMISSIONS, DYNAMIC_FORM_FIELDS } from '../../data/mockData.js';
import { COLORS } from '../../theme/colors.js';
import { isOverdue, daysOverdue } from '../../utils/demoClock.js';

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

export default function ActionDetailModal({ open, action, onClose }) {
  const { currentUser } = useAuth();
  const { users, setActionItems, formFields } = useAdmin();
  const perm = ROLE_PERMISSIONS[currentUser?.role] || {};
  const screens = Grid.useBreakpoint();
  const width = screens.md ? 720 : 620;

  const assignedToName = action
    ? users.find((u) => u.id === action.assignedTo)?.name || action.assignedToName
    : '';

  const overdue = action ? isOverdue(action.dueDate) : false;
  const defs = action ? formFields[action.activityType] || DYNAMIC_FORM_FIELDS[action.activityType] || [] : [];

  const fieldRows = useMemo(() => {
    if (!action) return [];
    return defs.map((d) => ({
      key: d.key,
      label: d.label,
      value: action[d.key],
      type: d.type,
    }));
  }, [action, defs]);

  const handleSendReminder = () => {
    if (!action) return;
    setActionItems((prev) =>
      prev.map((a) => (a.id === action.id ? { ...a, reminderSent: true } : a))
    );
    message.success(`Reminder sent to ${assignedToName}`);
  };

  const handleClose = () => {
    if (!action) return;
    setActionItems((prev) =>
      prev.map((a) =>
        a.id === action.id
          ? {
              ...a,
              status: 'Closed',
              reminderSent: a.reminderSent,
              // Keep `completionEvidence` editable as-is; for demo we can leave it blank.
            }
          : a
      )
    );
  };

  return (
    <Modal
      open={open}
      title={
        action ? (
          <Space wrap>
            <span style={{ fontFamily: 'monospace', fontWeight: 800 }}>{action.id}</span>
            <Tag color={statusTag(action.status).color}>{statusTag(action.status).text}</Tag>
            <Tag color={priorityTag(action.priority)}>{action.priority}</Tag>
            {action.reminderSent ? <Tag color={COLORS.accentOrange}>Reminder Sent</Tag> : null}
          </Space>
        ) : (
          'Action Item'
        )
      }
      width={width}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      style={{ maxWidth: '95vw' }}
      bodyStyle={{ maxHeight: '70vh', overflow: 'auto' }}
    >
      {!action ? null : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Descriptions bordered column={2} size="small">
            <Descriptions.Item label="Date">{action.date}</Descriptions.Item>
            <Descriptions.Item label="Department">{action.department}</Descriptions.Item>
            <Descriptions.Item label="Activity Type">{action.activityType}</Descriptions.Item>
            <Descriptions.Item label="Assigned To">{assignedToName}</Descriptions.Item>
          </Descriptions>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <Text strong>Due Date</Text>
              <div style={{ marginTop: 6 }}>
                <span style={{ color: overdue ? COLORS.danger : COLORS.darkText, fontWeight: 700 }}>
                  {action.dueDate}
                </span>
                {overdue ? (
                  <Tag color={COLORS.danger} style={{ marginLeft: 10 }}>
                    <WarningOutlined /> {daysOverdue(action.dueDate)} days overdue
                  </Tag>
                ) : (
                  <Tag style={{ marginLeft: 10 }}>On Track</Tag>
                )}
              </div>
            </div>

            <div>
              <Text strong>Title</Text>
              <div style={{ marginTop: 6 }}>{action.title}</div>
            </div>
          </div>

          {fieldRows.length ? (
            <div>
              <Text strong>Activity Details</Text>
              <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {fieldRows.map((r) => (
                  <div key={r.key} style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 8, padding: 10 }}>
                    <Text style={{ color: COLORS.grayText, fontSize: 12 }}>{r.label}</Text>
                    <div style={{ marginTop: 6, whiteSpace: 'pre-wrap' }}>
                      {r.value ? String(r.value) : '—'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {action.completionEvidence ? (
            <div>
              <Text strong>Completion Evidence</Text>
              <div style={{ marginTop: 6, background: '#fff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 8, padding: 10 }}>
                {action.completionEvidence}
              </div>
            </div>
          ) : null}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
            <Space>
              {perm.canAssign && action.status !== 'Closed' ? (
                <Button type="primary" icon={<MailOutlined />} onClick={handleSendReminder}>
                  Send Reminder
                </Button>
              ) : null}
              {perm.canClose && action.status !== 'Closed' ? (
                <Button
                  icon={<CheckCircleOutlined />}
                  style={{ background: COLORS.success, borderColor: COLORS.success, color: '#fff' }}
                  onClick={handleClose}
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


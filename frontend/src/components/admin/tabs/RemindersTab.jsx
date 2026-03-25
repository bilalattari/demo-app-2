import React, { useState } from 'react';
import { Alert, Button, Card, Input, InputNumber, Modal, Radio, Space, Switch, Steps, Typography, message } from 'antd';
import { useAuth } from '../../../context/AuthContext.jsx';
import { useAdmin } from '../../../context/AdminContext.jsx';
import { COLORS } from '../../../theme/colors.js';

const { Text, Paragraph } = Typography;
const { Step } = Steps;

export default function RemindersTab() {
  const { currentUser } = useAuth();
  const { reminderConfig, updateReminderConfig } = useAdmin();

  const [timing, setTiming] = useState({
    firstReminder: reminderConfig.firstReminder,
    secondReminder: reminderConfig.secondReminder,
    overdueReminder: reminderConfig.overdueReminder,
  });

  const [emailTemplate, setEmailTemplate] = useState({
    subject: reminderConfig.emailSubjectTemplate,
    body: reminderConfig.emailBodyTemplate,
  });

  const [sms, setSms] = useState({
    enabled: reminderConfig.smsEnabled,
    template: reminderConfig.smsTemplate,
  });

  const saveTiming = () => {
    updateReminderConfig(timing, currentUser);
    message.success('Reminder timing saved');
  };

  const saveEmail = () => {
    updateReminderConfig(
      {
        emailSubjectTemplate: emailTemplate.subject,
        emailBodyTemplate: emailTemplate.body,
      },
      currentUser
    );
    message.success('Email template saved');
  };

  const saveSms = () => {
    updateReminderConfig(
      {
        smsEnabled: sms.enabled,
        smsTemplate: sms.template,
      },
      currentUser
    );
    message.success('SMS settings saved');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <Text strong style={{ color: COLORS.darkText, fontSize: 16 }}>Reminder Schedule</Text>
        <div style={{ marginTop: 10 }}>
          <Steps current={2} size="small" labelPlacement="horizontal">
            <Step title="Assignment" />
            <Step title={`First: ${reminderConfig.firstReminder}d before`} />
            <Step title={`Second: ${reminderConfig.secondReminder}d before`} />
            <Step title="Due Date" />
            <Step title={`Overdue: every ${reminderConfig.overdueReminder}d`} />
          </Steps>
        </div>
      </div>

      <Card bordered={false} style={{ background: '#fff', borderRadius: 14 }}>
        <Space direction="vertical" size={14} style={{ width: '100%' }}>
          <Space>
            <Text style={{ width: 220 }}>Send first reminder</Text>
            <InputNumber value={timing.firstReminder} min={0} onChange={(v) => setTiming((p) => ({ ...p, firstReminder: v }))} />
            <Text>days before due date</Text>
          </Space>
          <Space>
            <Text style={{ width: 220 }}>Send second reminder</Text>
            <InputNumber value={timing.secondReminder} min={0} onChange={(v) => setTiming((p) => ({ ...p, secondReminder: v }))} />
            <Text>days before due date</Text>
          </Space>
          <Space>
            <Text style={{ width: 220 }}>Send overdue reminder every</Text>
            <InputNumber value={timing.overdueReminder} min={1} onChange={(v) => setTiming((p) => ({ ...p, overdueReminder: v }))} />
            <Text>days</Text>
          </Space>
          <Button type="primary" style={{ background: COLORS.brandBlue }} onClick={saveTiming}>
            Save Timing
          </Button>
        </Space>
      </Card>

      <Card bordered={false} style={{ background: '#fff', borderRadius: 14 }}>
        <Text strong style={{ color: COLORS.darkText, fontSize: 16 }}>Email Notification Template</Text>
        <div style={{ marginTop: 8 }}>
          <Alert
            type="info"
            showIcon
            message="Available variables: {itemId} {title} {assigneeName} {dueDate} {category} {priority}"
            style={{ borderRadius: 12 }}
          />
        </div>

        <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
          <Input
            value={emailTemplate.subject}
            onChange={(e) => setEmailTemplate((p) => ({ ...p, subject: e.target.value }))}
            placeholder="Subject template"
          />
          <Input.TextArea
            rows={8}
            value={emailTemplate.body}
            onChange={(e) => setEmailTemplate((p) => ({ ...p, body: e.target.value }))}
          />
          <Button type="primary" style={{ background: COLORS.brandBlue }} onClick={saveEmail}>
            Save Email Template
          </Button>
        </div>
      </Card>

      <Card bordered={false} style={{ background: '#fff', borderRadius: 14 }}>
        <Text strong style={{ color: COLORS.darkText, fontSize: 16 }}>SMS Notifications</Text>

        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
          <Switch checked={sms.enabled} onChange={(v) => setSms((p) => ({ ...p, enabled: v }))} />
          <Text>{sms.enabled ? 'Enabled' : 'Disabled'}</Text>
        </div>

        {sms.enabled ? (
          <div style={{ marginTop: 12 }}>
            <Input.TextArea
              rows={3}
              value={sms.template}
              onChange={(e) => setSms((p) => ({ ...p, template: e.target.value }))}
            />
          </div>
        ) : (
          <Alert type="warning" showIcon message="SMS notifications are currently disabled" style={{ marginTop: 12 }} />
        )}

        <div style={{ marginTop: 14 }}>
          <Button type="primary" style={{ background: COLORS.brandBlue }} onClick={saveSms} disabled={!sms.enabled && !sms.template}>
            Save SMS Settings
          </Button>
        </div>
      </Card>
    </div>
  );
}


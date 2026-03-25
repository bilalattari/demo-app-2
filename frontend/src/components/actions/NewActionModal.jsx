import React, { useMemo, useState } from 'react';
import {
  Button,
  DatePicker,
  Form,
  Grid,
  Input,
  Modal,
  Radio,
  Select,
  Space,
  message,
  Input as AntInput,
  Divider,
  Typography,
} from 'antd';
import dayjs from 'dayjs';

import { useAuth } from '../../context/AuthContext.jsx';
import { useAdmin } from '../../context/AdminContext.jsx';
import { ROLE_PERMISSIONS } from '../../data/mockData.js';
import { COLORS } from '../../theme/colors.js';

const { TextArea } = Input;
const { Text } = Typography;

function snakeToKey(label) {
  return String(label)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

export default function NewActionModal({ open, onClose }) {
  const { currentUser } = useAuth();
  const { users, formFields, setActionItems, departments } = useAdmin();
  const perm = ROLE_PERMISSIONS[currentUser?.role] || {};
  const screens = Grid.useBreakpoint();
  const width = screens.md ? 920 : 780;

  const [activityType, setActivityType] = useState(null);
  const [form] = Form.useForm();
  const [formValues, setFormValues] = useState({});

  const activityTypes = useMemo(() => Object.keys(formFields || {}), [formFields]);
  const fields = (activityType && formFields?.[activityType]) || [];

  const filteredFields = useMemo(() => {
    return fields.filter((f) => {
      if (!f.conditional) return true;
      const dependentValue = formValues?.[f.conditional.field];
      return String(dependentValue) === String(f.conditional.value);
    });
  }, [fields, formValues]);

  const onSubmit = (values) => {
    if (!perm.canCreate) {
      message.warning('You do not have permission to create action items.');
      return;
    }
    if (!activityType) {
      message.warning('Select an activity type first.');
      return;
    }

    const assignedUser = users.find((u) => u.id === values.assignedTo);
    const dateStr = values.date ? values.date.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD');
    const dueStr = values.dueDate ? values.dueDate.format('YYYY-MM-DD') : '';
    const year = dayjs(values.date || dayjs()).format('YYYY');
    const seq = String(Date.now()).slice(-4);
    const id = `ACT-${year}-${seq}`;

    const dynamicPayload = {};
    for (const f of fields) {
      if (!values.hasOwnProperty(f.key)) continue;
      if (f.type === 'date') {
        const v = values[f.key];
        dynamicPayload[f.key] = v ? v.format('YYYY-MM-DD') : '';
      } else {
        dynamicPayload[f.key] = values[f.key];
      }
    }

    const newItem = {
      id,
      activityType,
      title: values.title,
      date: dateStr,
      department: values.department,
      assignedTo: values.assignedTo,
      assignedToName: assignedUser?.name || '',
      dueDate: dueStr,
      status: 'In Progress',
      priority: values.priority,
      createdBy: currentUser.id,
      createdByName: currentUser.name,
      completionEvidence: '',
      reminderSent: false,
      ...dynamicPayload,
    };

    setActionItems((prev) => [newItem, ...prev]);
    message.success('Action item logged successfully');
    onClose();
  };

  const infoColor = COLORS.brandBlue;

  return (
    <Modal
      open={open}
      title="New Action Item"
      width={width}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      style={{ maxWidth: '95vw' }}
      bodyStyle={{ maxHeight: '75vh', overflow: 'auto' }}
    >
      {!perm.canCreate ? (
        <Text>You do not have permission to create action items.</Text>
      ) : (
        <Form
          form={form}
          layout="vertical"
          onValuesChange={(changed, all) => setFormValues(all)}
          onFinish={onSubmit}
          initialValues={{
            priority: 'Medium',
          }}
        >
          <Form.Item
            label="Select Activity Type"
            name="activityType"
            rules={[{ required: true, message: 'Select an activity type' }]}
          >
            <Select
              placeholder="Choose activity type"
              onChange={(v) => {
                setActivityType(v);
                form.setFieldValue('activityType', v);
              }}
              options={activityTypes.map((t) => ({ value: t, label: t }))}
            />
          </Form.Item>

          {!activityType ? (
            <div
              style={{
                background: 'rgba(27,63,123,0.06)',
                border: '1px solid rgba(27,63,123,0.18)',
                borderRadius: 10,
                padding: 14,
                marginBottom: 12,
              }}
            >
              <Text style={{ color: infoColor, fontWeight: 700 }}>← Select an Activity Type above to load the relevant form fields</Text>
            </div>
          ) : null}

          <Divider orientation="left" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
            Core Details
          </Divider>

          <Form.Item label="Title" name="title" rules={[{ required: true }]}>
            <Input placeholder="Short title for the action item" />
          </Form.Item>

          <Form.Item label="Date" name="date" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label="Department" name="department" rules={[{ required: true }]}>
            <Select options={(departments || []).map((d) => ({ value: d, label: d }))} />
          </Form.Item>

          <Form.Item label="Assigned To" name="assignedTo" rules={[{ required: true }]}>
            <Select options={users.map((u) => ({ value: u.id, label: u.name }))} />
          </Form.Item>

          <Form.Item label="Due Date" name="dueDate" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label="Priority" name="priority" rules={[{ required: true }]}>
            <Select options={['Critical', 'High', 'Medium', 'Low'].map((p) => ({ value: p, label: p }))} />
          </Form.Item>

          {activityType ? (
            <>
              <Divider orientation="left" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                Activity-Specific Details
              </Divider>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {filteredFields.map((f) => {
                  const label = f.label;
                  const required = !!f.required;
                  const baseRules = required ? [{ required: true, message: `${label} is required` }] : [];

                  if (f.type === 'textarea') {
                    return (
                      <Form.Item key={f.key} label={label} name={f.key} rules={baseRules}>
                        <TextArea rows={4} />
                      </Form.Item>
                    );
                  }
                  if (f.type === 'text') {
                    return (
                      <Form.Item key={f.key} label={label} name={f.key} rules={baseRules}>
                        <Input />
                      </Form.Item>
                    );
                  }
                  if (f.type === 'date') {
                    return (
                      <Form.Item key={f.key} label={label} name={f.key} rules={baseRules}>
                        <DatePicker style={{ width: '100%' }} />
                      </Form.Item>
                    );
                  }
                  if (f.type === 'select') {
                    return (
                      <Form.Item key={f.key} label={label} name={f.key} rules={baseRules}>
                        <Select options={(f.options || []).map((o) => ({ value: o, label: o }))} />
                      </Form.Item>
                    );
                  }
                  if (f.type === 'radio') {
                    return (
                      <Form.Item key={f.key} label={label} name={f.key} rules={baseRules}>
                        <Radio.Group>
                          {(f.options || []).map((o) => (
                            <Radio key={o} value={o}>
                              {o}
                            </Radio>
                          ))}
                        </Radio.Group>
                      </Form.Item>
                    );
                  }
                  if (f.type === 'user_select') {
                    return (
                      <Form.Item key={f.key} label={label} name={f.key} rules={baseRules}>
                        <Select
                          options={users.map((u) => ({ value: u.name, label: u.name }))}
                          placeholder="Select user"
                        />
                      </Form.Item>
                    );
                  }

                  // Fallback to text input
                  return (
                    <Form.Item key={f.key} label={label} name={f.key} rules={baseRules}>
                      <Input />
                    </Form.Item>
                  );
                })}
              </div>
            </>
          ) : null}

          <Form.Item style={{ marginTop: 14 }}>
            <Space size={12}>
              <Button htmlType="submit" type="primary" style={{ background: COLORS.brandBlue }}>
                Submit
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
}


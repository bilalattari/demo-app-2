import React, { useMemo, useState } from 'react';
import {
  Button,
  Card,
  Col,
  Divider,
  Input,
  Modal,
  Popconfirm,
  Radio,
  Row,
  Select,
  Switch,
  Tag,
  Space,
  Typography,
  Form,
  message,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { useAuth } from '../../../context/AuthContext.jsx';
import { useAdmin } from '../../../context/AdminContext.jsx';
import { COLORS } from '../../../theme/colors.js';
import FieldEditorRow from '../shared/FieldEditorRow.jsx';

const { Text } = Typography;

function snakeCaseFromLabel(label) {
  return String(label || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function fieldTypeBadgeColor(type) {
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

export default function FormBuilderTab() {
  const { currentUser } = useAuth();
  const {
    formFields,
    addFormField,
    updateFormField,
    deleteFormField,
    reorderFormFields,
  } = useAdmin();

  const activityTypes = useMemo(() => Object.keys(formFields || {}), [formFields]);
  const [selectedType, setSelectedType] = useState(activityTypes[0] || null);

  const currentFields = formFields?.[selectedType] || [];

  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const defaultDraft = {
    label: '',
    type: 'text',
    required: false,
    options: [],
    conditionalEnabled: false,
    conditionalFieldKey: '',
    conditionalValue: '',
  };

  const [draft, setDraft] = useState(defaultDraft);

  const openAdd = () => {
    setEditingIndex(null);
    setDraft({
      ...defaultDraft,
      conditionalFieldKey: currentFields[0]?.key || '',
    });
    setModalOpen(true);
  };

  const openEdit = (idx) => {
    const f = currentFields[idx];
    setEditingIndex(idx);
    setDraft({
      label: f.label,
      type: f.type,
      required: !!f.required,
      options: Array.isArray(f.options) ? [...f.options] : [],
      conditionalEnabled: !!f.conditional,
      conditionalFieldKey: f.conditional?.field || currentFields[0]?.key || '',
      conditionalValue: f.conditional?.value || '',
    });
    setModalOpen(true);
  };

  const saveField = () => {
    if (!selectedType) return;
    if (!currentUser) return;

    if (!draft.label.trim()) {
      message.error('Field label is required');
      return;
    }

    const key = snakeCaseFromLabel(draft.label);
    if (!key) {
      message.error('Field key could not be generated');
      return;
    }

    const payload = {
      key,
      label: draft.label.trim(),
      type: draft.type,
      required: !!draft.required,
    };

    if (draft.type === 'select' || draft.type === 'radio') {
      payload.options = (draft.options || []).filter((o) => String(o).trim().length > 0);
      if (!payload.options.length) {
        message.error('Please add at least one option for this field type');
        return;
      }
    }

    if (draft.conditionalEnabled) {
      if (!draft.conditionalFieldKey || !String(draft.conditionalValue).trim()) {
        message.error('Conditional field and value are required');
        return;
      }
      payload.conditional = {
        field: draft.conditionalFieldKey,
        value: String(draft.conditionalValue).trim(),
      };
    }

    if (editingIndex === null) {
      addFormField(selectedType, payload, currentUser);
    } else {
      updateFormField(selectedType, editingIndex, payload, currentUser);
    }

    setModalOpen(false);
  };

  const reorder = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= currentFields.length) return;
    const newFields = [...currentFields];
    const tmp = newFields[fromIndex];
    newFields[fromIndex] = newFields[toIndex];
    newFields[toIndex] = tmp;
    reorderFormFields(selectedType, newFields, currentUser);
  };

  return (
    <div>
      <Row gutter={16}>
        <Col xs={24} md={7}>
          <div style={{ position: 'sticky', top: 20 }}>
            <Text strong style={{ color: COLORS.darkText }}>Activity Types</Text>
            <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {activityTypes.map((t) => {
                const count = (formFields?.[t] || []).length;
                const active = t === selectedType;
                return (
                  <Card
                    key={t}
                    size="small"
                    hoverable
                    onClick={() => setSelectedType(t)}
                    style={{
                      cursor: 'pointer',
                      borderRadius: 14,
                      background: active ? 'rgba(46,109,180,0.10)' : '#fff',
                      border: active ? `1px solid rgba(46,109,180,0.35)` : '1px solid rgba(0,0,0,0.06)',
                    }}
                    bodyStyle={{ padding: 12 }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                      <Text style={{ fontWeight: 800 }}>{t}</Text>
                      <Tag color={active ? COLORS.brandBlue : '#E5E7EB'}>{count}</Tag>
                    </div>
                  </Card>
                );
              })}
            </div>
            <Divider />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Changes here update the Action Items form instantly.
            </Text>
          </div>
        </Col>

        <Col xs={24} md={17}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <div>
              <Text strong style={{ fontSize: 16, color: COLORS.darkText }}>
                Form Fields: {selectedType}
              </Text>
              <div style={{ color: COLORS.grayText, fontSize: 12, marginTop: 4 }}>
                Total fields: <Tag>{currentFields.length}</Tag>
              </div>
            </div>
            <Button type="primary" icon={<PlusOutlined />} onClick={openAdd} style={{ background: COLORS.brandBlue }}>
              Add New Field
            </Button>
          </div>

          <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {currentFields.length ? (
              currentFields.map((f, idx) => (
                <FieldEditorRow
                  key={`${selectedType}-${f.key}-${idx}`}
                  field={f}
                  index={idx}
                  canMoveUp={idx > 0}
                  canMoveDown={idx < currentFields.length - 1}
                  onMoveUp={() => reorder(idx, idx - 1)}
                  onMoveDown={() => reorder(idx, idx + 1)}
                  onEdit={() => openEdit(idx)}
                  onDelete={() => {
                    // Delete via Popconfirm handled below by outer wrapper.
                    deleteFormField(selectedType, idx, currentUser);
                  }}
                />
              ))
            ) : (
              <Card>
                <Text type="secondary">No fields configured. Add a field to get started.</Text>
              </Card>
            )}
          </div>

          {/* Lightweight delete confirmation */}
          <div style={{ marginTop: 10, color: '#9CA3AF', fontSize: 12 }}>
            Tip: Use the trash button to delete a field.
          </div>
        </Col>
      </Row>

      <Modal
        open={modalOpen}
        title={editingIndex === null ? 'Add Field' : 'Edit Field'}
        width={760}
        onCancel={() => setModalOpen(false)}
        onOk={saveField}
        okText="Save"
        cancelText="Cancel"
        destroyOnClose
        style={{ maxWidth: '95vw' }}
        bodyStyle={{ maxHeight: '75vh', overflow: 'auto' }}
      >
        <Form layout="vertical">
          <Form.Item label="Field Label" required>
            <Input
              value={draft.label}
              onChange={(e) => setDraft((p) => ({ ...p, label: e.target.value }))}
              placeholder="e.g. Third Party Inspector Present"
            />
            <div style={{ marginTop: 6, color: COLORS.grayText, fontSize: 12 }}>
              Auto key: <span style={{ fontFamily: 'monospace' }}>{snakeCaseFromLabel(draft.label) || '—'}</span>
            </div>
          </Form.Item>

          <Form.Item label="Field Type" required>
            <Select
              value={draft.type}
              onChange={(v) => setDraft((p) => ({ ...p, type: v }))}
              options={[
                { value: 'text', label: 'Text Input' },
                { value: 'textarea', label: 'Textarea' },
                { value: 'select', label: 'Dropdown (Select)' },
                { value: 'radio', label: 'Radio Group' },
                { value: 'date', label: 'Date Picker' },
                { value: 'user_select', label: 'User Select' },
              ]}
            />
          </Form.Item>

          {(draft.type === 'select' || draft.type === 'radio') ? (
            <Form.Item label="Options" required>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {(draft.options || []).map((opt, i) => (
                  <Space key={`${opt}-${i}`} align="baseline">
                    <Input
                      value={opt}
                      onChange={(e) => {
                        const next = [...draft.options];
                        next[i] = e.target.value;
                        setDraft((p) => ({ ...p, options: next }));
                      }}
                      style={{ width: 340 }}
                    />
                    <Button
                      danger
                      onClick={() => {
                        const next = [...draft.options];
                        next.splice(i, 1);
                        setDraft((p) => ({ ...p, options: next }));
                      }}
                    >
                      Remove
                    </Button>
                  </Space>
                ))}

                <Button
                  type="dashed"
                  onClick={() => setDraft((p) => ({ ...p, options: [...(p.options || []), ''] }))}
                  style={{ width: 'fit-content' }}
                >
                  + Add Option
                </Button>
              </div>
            </Form.Item>
          ) : null}

          <Form.Item label="Required?">
            <Switch checked={draft.required} onChange={(v) => setDraft((p) => ({ ...p, required: v }))} />
          </Form.Item>

          <Divider />
          <Form.Item label="Conditional Display">
            <Switch
              checked={draft.conditionalEnabled}
              onChange={(v) =>
                setDraft((p) => ({
                  ...p,
                  conditionalEnabled: v,
                  conditionalFieldKey: p.conditionalFieldKey || currentFields[0]?.key || '',
                }))
              }
            />
            {draft.conditionalEnabled ? (
              <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Select
                  value={draft.conditionalFieldKey}
                  onChange={(v) => setDraft((p) => ({ ...p, conditionalFieldKey: v }))}
                  options={(currentFields || []).map((f) => ({ value: f.key, label: f.label }))}
                />
                <Input
                  value={draft.conditionalValue}
                  onChange={(e) => setDraft((p) => ({ ...p, conditionalValue: e.target.value }))}
                  placeholder="Value equals (e.g. Yes)"
                />
              </div>
            ) : (
              <div style={{ marginTop: 8, color: COLORS.grayText, fontSize: 12 }}>
                When OFF, the field is always visible.
              </div>
            )}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}


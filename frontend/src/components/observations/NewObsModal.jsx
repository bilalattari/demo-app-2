import React, { useMemo, useState } from 'react';
import { Button, DatePicker, Form, Grid, Input, Modal, Select, Switch, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

import { useAuth } from '../../context/AuthContext.jsx';
import { useAdmin } from '../../context/AdminContext.jsx';
import { ROLE_PERMISSIONS } from '../../data/mockData.js';
import { COLORS } from '../../theme/colors.js';

export default function NewObsModal({ open, onClose }) {
  const { currentUser } = useAuth();
  const { categories, locations, departments, users, setObservations } = useAdmin();
  const perm = ROLE_PERMISSIONS[currentUser?.role] || {};
  const screens = Grid.useBreakpoint();
  const width = screens.md ? 800 : 680;

  const assignCandidates = useMemo(
    () => users.filter((u) => u.role === 'focal_person' || u.role === 'hseq_officer'),
    [users]
  );

  const [fileList, setFileList] = useState([]);

  const onSubmit = (values) => {
    if (!perm.canCreate) {
      message.warning('You do not have permission to create observations.');
      return;
    }

    const dateStr = values.date ? values.date.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD');
    const dueDateStr = values.dueDate ? values.dueDate.format('YYYY-MM-DD') : '';

    const assignUser = users.find((u) => u.id === values.assignTo);
    const ccUsers = (values.cc || []).map((id) => users.find((u) => u.id === id)).filter(Boolean);

    const evidence = fileList.map((f) => f.name || f.file?.name).filter(Boolean);

    const year = dayjs(values.date || dayjs()).format('YYYY');
    const seq = String(Date.now()).slice(-4);
    const id = `OBS-${year}-${seq}`;

    const newObservation = {
      id,
      date: dateStr,
      location: values.location,
      department: values.department,
      category: values.category,
      status: 'Open',
      description: values.description,
      correctiveAction: values.correctiveAction,
      evidence,
      assignedTo: values.assignTo,
      assignedToName: assignUser?.name || '',
      cc: values.cc || [],
      createdBy: currentUser.id,
      createdByName: currentUser.name,
      dueDate: dueDateStr,
      closedDate: null,
      reminderSent: false,
      priority: values.priority,
    };

    setObservations((prev) => [newObservation, ...prev]);
    message.success('Observation logged successfully');
    onClose();
  };

  return (
    <Modal
      open={open}
      title="New Observation"
      width={width}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      style={{ maxWidth: '95vw' }}
      bodyStyle={{ maxHeight: '75vh', overflow: 'auto' }}
    >
      <Form layout="vertical" onFinish={onSubmit}>
        <Form.Item label="Date" name="date" initialValue={dayjs()}>
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="Location" name="location" rules={[{ required: true }]}>
          <Select options={locations.map((l) => ({ value: l, label: l }))} />
        </Form.Item>

        <Form.Item label="Department" name="department" rules={[{ required: true }]}>
          <Select options={departments.map((d) => ({ value: d, label: d }))} />
        </Form.Item>

        <Form.Item label="Category" name="category" rules={[{ required: true }]}>
          <Select options={categories.map((c) => ({ value: c, label: c }))} />
        </Form.Item>

        <Form.Item label="Priority" name="priority" rules={[{ required: true }]}>
          <Select
            options={[
              { value: 'Critical', label: 'Critical' },
              { value: 'High', label: 'High' },
              { value: 'Medium', label: 'Medium' },
              { value: 'Low', label: 'Low' },
            ]}
          />
        </Form.Item>

        <Form.Item label="Description" name="description" rules={[{ required: true }]}>
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item label="Corrective Action" name="correctiveAction" rules={[{ required: true }]}>
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item label="Assign To" name="assignTo" rules={[{ required: true }]}>
          <Select options={assignCandidates.map((u) => ({ value: u.id, label: `${u.name} (${u.department})` }))} />
        </Form.Item>

        <Form.Item label="CC" name="cc">
          <Select
            mode="multiple"
            allowClear
            options={users.map((u) => ({ value: u.id, label: u.name }))}
          />
        </Form.Item>

        <Form.Item label="Due Date" name="dueDate" rules={[{ required: true }]}>
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="Evidence (visual only)">
          <Upload
            beforeUpload={() => false}
            fileList={fileList}
            onChange={(info) => setFileList(info.fileList)}
            maxCount={4}
          >
            <Button icon={<UploadOutlined />}>Select files</Button>
          </Upload>
          <div style={{ marginTop: 6, color: COLORS.grayText, fontSize: 12 }}>
            This demo doesn't upload files; filenames are stored for display.
          </div>
        </Form.Item>

        <Form.Item style={{ marginTop: 8 }}>
          <Button type="primary" htmlType="submit" style={{ background: COLORS.brandBlue, width: '100%' }}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}


import React, { useMemo, useState } from 'react';
import { Button, Card, Col, Row, Select, Space, Typography } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

import { KPI_DATA, MOCK_OBSERVATIONS } from '../../data/mockData';
import { useAdmin } from '../../context/AdminContext.jsx';
import { exportJsonToExcel } from '../../utils/excel.js';

import { COLORS } from '../../theme/colors.js';
import KpiCards from './KpiCards.jsx';
import ObsTrendChart from './ObsTrendChart.jsx';
import CategoryPieChart from './CategoryPieChart.jsx';
import DeptBarChart from './DeptBarChart.jsx';
import ActionTypeChart from './ActionTypeChart.jsx';
import OverdueTable from './OverdueTable.jsx';

const { Title } = Typography;

export default function DashboardPage() {
  const { observations } = useAdmin();
  const [period, setPeriod] = useState('Month');

  const exportDashboard = () => {
    const todayStr = new Date().toISOString().split('T')[0];

    const sheets = {
      'HSEQ KPIs': [{ ...KPI_DATA.summary }],
      Observations: observations.map((o) => ({
        'Observation ID': o.id,
        'Date': o.date,
        'Location': o.location,
        'Department': o.department,
        'Category': o.category,
        'Status': o.status,
        'Priority': o.priority,
        'Assigned To': o.assignedToName,
        'Due Date': o.dueDate,
        'Closed Date': o.closedDate || 'Open',
      })),
    };

    exportJsonToExcel(`HSEQ_Report_${todayStr}.xlsx`, sheets);
  };

  const kpiCards = useMemo(() => KPI_DATA.summary, []);

  return (
    <div>
      <Row justify="space-between" align="middle" gutter={16}>
        <Col>
          <Title level={3} style={{ margin: 0, color: COLORS.darkText }}>
            HSEQ Dashboard
          </Title>
          <div style={{ color: COLORS.grayText, fontSize: 12, marginTop: 4 }}>
            Demo filters: {period} (visual only)
          </div>
        </Col>
        <Col>
          <Space size={12} align="center">
            <Select
              value={period}
              onChange={setPeriod}
              options={[
                { value: 'Month', label: 'Month' },
                { value: 'Quarter', label: 'Quarter' },
                { value: 'Year', label: 'Year' },
              ]}
              style={{ width: 160 }}
            />
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={exportDashboard}
              style={{ background: COLORS.brandBlue }}
            >
              Export to Excel
            </Button>
          </Space>
        </Col>
      </Row>

      <div style={{ marginTop: 16, padding: '0 2px' }}>
        <KpiCards summary={kpiCards} />
      </div>

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col xs={24} md={14}>
          <Card bordered={false} style={{ background: '#fff' }}>
            <ObsTrendChart />
          </Card>
        </Col>
        <Col xs={24} md={10}>
          <Card bordered={false} style={{ background: '#fff' }}>
            <CategoryPieChart />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col xs={24} md={12}>
          <Card bordered={false} style={{ background: '#fff' }}>
            <DeptBarChart />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card bordered={false} style={{ background: '#fff' }}>
            <ActionTypeChart />
          </Card>
        </Col>
      </Row>

      <div style={{ marginTop: 16 }}>
        <Card bordered={false} style={{ background: '#fff' }}>
          <OverdueTable />
        </Card>
      </div>
    </div>
  );
}


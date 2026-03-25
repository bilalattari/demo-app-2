import React from 'react';
import { Card, Col, Row, Tag, Typography } from 'antd';
import { COLORS } from '../../theme/colors.js';

const { Text } = Typography;

const trendStyle = {
  fontWeight: 700,
  fontSize: 12,
  marginTop: 2,
};

export default function KpiCards({ summary }) {
  const cards = [
    { label: 'Total Observations', value: summary.totalObservations, color: COLORS.brandBlue, arrow: '↑' },
    { label: 'Open Observations', value: summary.openObservations, color: COLORS.accentOrange, arrow: '↓' },
    { label: 'Closed This Month', value: summary.closedObservations, color: COLORS.success, arrow: '↑' },
    { label: 'Overdue Actions', value: summary.overdueActions, color: COLORS.danger, arrow: '!' },
    { label: 'LTIR', value: summary.ltir, color: COLORS.success, arrow: '↓' },
    { label: 'Near Misses (YTD)', value: summary.nearMisses, color: COLORS.warning, arrow: '↑' },
  ];

  return (
    <Row gutter={[16, 20]}>
      {cards.map((c) => (
        <Col key={c.label} xs={24} sm={12} md={8}>
          <Card
            bordered={false}
            style={{
              background: '#fff',
              borderTop: `4px solid ${c.color}`,
              boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
              minHeight: 86,
            }}
            bodyStyle={{ padding: 14 }}
          >
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: COLORS.darkText }}>{c.value}</div>
              <Tag style={{ background: 'rgba(0,0,0,0.03)', border: `1px solid rgba(0,0,0,0.05)` }} color={c.color}>
                {c.arrow}
              </Tag>
            </div>
            <Text style={{ color: COLORS.grayText, fontSize: 12 }}>{c.label}</Text>
          </Card>
        </Col>
      ))}
    </Row>
  );
}


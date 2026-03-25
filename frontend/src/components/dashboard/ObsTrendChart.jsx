import React from 'react';
import { Grid, Typography } from 'antd';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { KPI_DATA } from '../../data/mockData';
import { COLORS } from '../../theme/colors.js';

const { Title } = Typography;

export default function ObsTrendChart() {
  const screens = Grid.useBreakpoint();
  const height = screens.md ? 260 : 220;

  return (
    <div>
      <Title level={4} style={{ margin: '8px 0 10px', color: COLORS.darkText }}>
        Monthly Observations & Actions Trend
      </Title>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={KPI_DATA.monthlyTrend}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend verticalAlign="bottom" />
          <Line type="monotone" dataKey="observations" stroke={COLORS.brandLightBlue} strokeWidth={2} name="Observations" />
          <Line type="monotone" dataKey="actionsOpen" stroke={COLORS.accentOrange} strokeWidth={2} name="Actions Open" />
          <Line type="monotone" dataKey="actionsClosed" stroke={COLORS.success} strokeWidth={2} name="Actions Closed" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}


import React from 'react';
import { Grid, Typography } from 'antd';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

import { KPI_DATA } from '../../data/mockData';
import { COLORS } from '../../theme/colors.js';

const { Title } = Typography;

export default function DeptBarChart() {
  const screens = Grid.useBreakpoint();
  const height = screens.md ? 260 : 220;

  return (
    <div>
      <Title level={4} style={{ margin: '8px 0 10px', color: COLORS.darkText }}>
        Department Safety Performance
      </Title>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={KPI_DATA.observationsByDepartment}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="department" interval={0} angle={-45} textAnchor="end" height={80} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="closed" stackId="a" name="Closed" fill={COLORS.success} />
          <Bar dataKey="open" stackId="a" name="Open" fill={COLORS.accentOrange} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}


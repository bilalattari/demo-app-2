import React from 'react';
import { Grid, Typography } from 'antd';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

import { KPI_DATA } from '../../data/mockData';
import { COLORS } from '../../theme/colors.js';

const { Title } = Typography;

export default function ActionTypeChart() {
  const screens = Grid.useBreakpoint();
  const height = screens.md ? 260 : 220;

  return (
    <div>
      <Title level={4} style={{ margin: '8px 0 10px', color: COLORS.darkText }}>
        Action Items by Activity Type
      </Title>
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          <BarChart data={KPI_DATA.actionsByType} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="type" type="category" width={150} />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="count"
              name="Count"
              radius={[0, 4, 4, 0]}
              label={{ position: 'right', fill: '#555' }}
            >
              {KPI_DATA.actionsByType.map((it) => (
                <Cell key={it.type} fill={it.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}


import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Typography } from 'antd';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
} from 'recharts';

import { KPI_DATA } from '../../data/mockData';
import { COLORS } from '../../theme/colors.js';

const { Title } = Typography;

export default function CategoryPieChart() {
  const boxRef = useRef(null);
  const [boxWidth, setBoxWidth] = useState(0);

  useEffect(() => {
    if (!boxRef.current) return;
    const el = boxRef.current;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect?.width || 0;
      setBoxWidth(w);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const isMobile = boxWidth > 0 ? boxWidth < 420 : false;
  const pieOuterRadius = useMemo(() => {
    if (!boxWidth) return 95;
    const target = boxWidth * 0.32;
    return Math.max(70, Math.min(95, target));
  }, [boxWidth]);

  return (
    <div>
      <Title level={4} style={{ margin: '8px 0 10px', color: COLORS.darkText }}>
        Observations by Category
      </Title>
      <div ref={boxRef} style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer>
          <PieChart margin={{ top: 10, right: isMobile ? 0 : 0, bottom: isMobile ? 10 : 0, left: 0 }}>
            <Tooltip
              formatter={(value, name) => [`${value} observations`, name]}
            />
            <Pie
              data={KPI_DATA.observationsByCategory}
              dataKey="count"
              nameKey="category"
              innerRadius={60}
              outerRadius={pieOuterRadius}
              paddingAngle={2}
              labelLine={false}
            >
              {KPI_DATA.observationsByCategory.map((it) => (
                <Cell key={it.category} fill={it.color} />
              ))}
            </Pie>
            <Legend
              wrapperStyle={{ fontSize: isMobile ? 12 : 13 }}
              layout={isMobile ? 'horizontal' : 'vertical'}
              verticalAlign={isMobile ? 'bottom' : 'middle'}
              align={isMobile ? 'center' : 'right'}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}


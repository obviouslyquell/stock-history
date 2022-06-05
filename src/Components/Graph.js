import React, { useContext, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { dataContext } from '../context';
import CustomizedDot from './CustomizedDot';

function Graph() {
  const { dataValue, setDataValue } = useContext(dataContext);
  console.log(dataValue.arr);
  return (
    <div className="graph">
      <h1 className="graph__ticket">{dataValue.ticket}</h1>
      <ResponsiveContainer width="100%" height={500}>
        <AreaChart data={dataValue.arr} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.9} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="name"
            reversed={true}
            axisLine={false}
            tickLine={false}
            domain={[Math.ceil(dataValue.min) - 200, 'auto']}
          />
          <YAxis
            domain={[0, Math.ceil(dataValue.max)]}
            axisLine={false}
            tickLine={false}
            tickCount={6}
            tickFormatter={(i) => `$${i.toFixed(2)}`}
          />
          <CartesianGrid strokeDasharray="3 4" vertical={false} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="price"
            stroke="#8884d8"
            stackId="1"
            fillOpacity={1}
            fill="url(#colorUv)"
            activeDot={{ stroke: 'white', strokeWidth: 1, r: 3 }}
          />
          <Area type="monotone" dataKey="div" stackId="2" stroke="#82ca9d" fill="#82ca9d" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active) {
    return (
      <div className="tooltip">
        <h4 className="tooltip__date">{label}</h4>
        <p>Price: {payload && payload[0].value}</p>
        <p>Dividends: {payload && payload[0].payload.div}</p>
      </div>
    );
  }
};

export default Graph;

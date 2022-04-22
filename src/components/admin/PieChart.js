import React, { memo } from "react";
import {
  PieChart,
  Pie,
  Cell as PieCell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const PiChart = ({ colors, state }) => {
  //   const { getTotalGroupedContributions } = useContributions();

  //   console.log(getTotalGroupedContributions());
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart width={500} height={500}>
        <Pie
          data={state}
          cx="50%"
          cy="50%"
          labelLine={true}
          label={(c) => c.name}
          outerRadius={80}
          dataKey="value"
        >
          {state?.map((entry, index) => (
            <>
              <PieCell key={index} fill={colors[index]} />
              <span className="absolute text-black">1</span>
            </>
          ))}
        </Pie>
        <Tooltip formatter={(value) => value.toLocaleString()} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};
export default memo(PiChart);
